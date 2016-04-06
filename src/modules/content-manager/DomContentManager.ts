import request from "superagent";
import { IStorage } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";
import { EventEmitter } from "events";
import { PromiseFactory } from "../storage/PromiseFactory";
import { IDomContentManager, CacheOptions } from "./ContentManager";
import moment from "moment";

export interface ICacheWrapper {
    data: any;
    lastSyncDate: number;
    //appVersion: number;
    //sessionTag: number;
}

function CacheWrapper(data: any, lastSyncDate: number = Date.now()): ICacheWrapper {
    return { data, lastSyncDate };
}

export class DomContentManager extends EventEmitter implements IDomContentManager {
    contentReadyEventName = "contentready";
    requestStartEventName = "requeststart";
    backgroundRequestStartEventName = "backgroundrequeststart";

    pathKeyPrefix = ContentResolver.DefaultPathKeyPrefix;

    private _store: IStorage<ICacheWrapper>;
    private _sessionStore: IStorage<string>;
    private _resolver: ContentResolver;
    private _lastKnownPathName: string = null;
    private _inlineCacheFlushed = false;

    constructor(resolver: ContentResolver, store: IStorage<ICacheWrapper>, sessionStore: IStorage<string>) {
        super();
        this._store = store;
        this._resolver = resolver;
        this._sessionStore.tryGetOrSet("_", Date.now().toString());
    }

    flushInlineCacheAsync(pathKey: string) {
        if (__DOM__) {
            if (!this._inlineCacheFlushed) {
                this._inlineCacheFlushed = true;
                let data = (window as any)[ContentResolver.InlineDataCacheKey];
                if (data != null) {
                    (window as any)[ContentResolver.InlineDataCacheKey] = null;
                    return this._store.set(pathKey, CacheWrapper(data));
                }
            }
        }
        return PromiseFactory.PromiseEmpty;
    }

    queuePath(pathname: string, cacheOptions: CacheOptions = { check: true, store: true }) {
        // If the same path is requested again, always refresh the data transparently.
        if (__DEV__ || (this._lastKnownPathName !== null && this._lastKnownPathName === pathname)) {
            cacheOptions.check = false;
        }
        let resolved = this._resolver.resolve(pathname);
        if (resolved.contentPath !== null) {
            this.getContentAsync(resolved.contentPath, cacheOptions)
            .then(x => {
                this._lastKnownPathName = pathname;
                this.emit(this.contentReadyEventName, resolved.factory(x));
            });
        } else {
            this.emit(this.contentReadyEventName, resolved.factory());
        }
    }

    getContentAsync(path: string, cacheOptions: CacheOptions = { check: false, store: false }) {
        let storeKey = this.pathKeyPrefix + path;
        return this.flushInlineCacheAsync(storeKey)
            .then(() => this._store.tryGet(storeKey))
            .then(x => {
                if (cacheOptions.check && x.exists) {
                    let wrapper = x.result;
                    let lastSyncDateRaw = wrapper.lastSyncDate;
                    if (lastSyncDateRaw) {
                        let lastSyncDate = moment(lastSyncDateRaw);
                        // if last check was less than a day.
                        let freshFrom = moment().subtract({ days: 1 });
                        if (lastSyncDate.diff(freshFrom) > 0) {
                            // queue a background update for future , but return from cache
                            // TODO: later once a last update date is added, check to see if it really
                            // was a new version, and if so, notify user.
                            setTimeout(() => this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions, false), 1000);
                            return x.result.data;
                        }
                    }
                }
                return this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions);
            });
    }

    fetchRemoteAndStoreAsync(path: string, storeKey: string, cacheOptions: CacheOptions, isBackgroundRequest = true) {
        return this.fetchRemoteContentAsync(path, isBackgroundRequest)
            .then((data: any) => {
                cacheOptions.store && this._store.set(storeKey, CacheWrapper(data));
                return data;
            });
    }

    fetchRemoteContentAsync(path: string, isBackgroundRequest: boolean) {
        return new Promise((resolve, reject) => {
            let req = request.get(path)
                .end((err, res) => {
                    if (err) reject(err);
                    else if (!res.ok) reject(res);
                    else resolve(res.body);
                });
            this.emit(isBackgroundRequest ? this.backgroundRequestStartEventName : this.requestStartEventName, req);
        });
    }
}