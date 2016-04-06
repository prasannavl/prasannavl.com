import request from "superagent";
import { EventEmitter } from "events";
import { IStorage } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";
import { PromiseFactory } from "../storage/PromiseFactory";
import moment from "moment";

export interface CacheOptions {
    check: boolean;
    store: boolean;
}

export interface ICacheWrapper {
    data: any;
    lastSyncDate: number;
}

function CacheWrapper(data: any, lastSyncDate: number = Date.now()): ICacheWrapper {
    return { data, lastSyncDate };
}

export class DomContentManager extends EventEmitter {
    contentEventName = "content";
    requestStartEventName = "requeststart";

    pathKeyPrefix = ContentResolver.DefaultPathKeyPrefix;

    private _store: IStorage<ICacheWrapper>;
    private _resolver: ContentResolver;
    private _lastKnownPathName: string = null;
    private _inlineCacheFlushed = false;

    constructor(resolver: ContentResolver, store: IStorage<ICacheWrapper>) {
        super();
        this._store = store;
        this._resolver = resolver;
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

    setPath(pathname: string, cacheOptions: CacheOptions = { check: true, store: true }) {
        if (__DEV__ || (this._lastKnownPathName !== null && this._lastKnownPathName === pathname)) {
            cacheOptions.check = false;
        }
        let resolved = this._resolver.resolve(pathname);
        if (resolved.contentPath !== null) {
            this.getContentAsync(resolved.contentPath, cacheOptions)
            .then(x => {
                this._lastKnownPathName = pathname;
                this.emit(this.contentEventName, resolved.factory(x));
            });
        } else {
            this.emit(this.contentEventName, resolved.factory());
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
                            setTimeout(() => this.fetchAndStore(path, storeKey, cacheOptions, false), 1000);
                            return x.result.data;
                        }
                    }
                }
                return this.fetchAndStore(path, storeKey, cacheOptions);
            });
    }

    fetchAndStore(path: string, storeKey: string, cacheOptions: CacheOptions, broadcastRequest = true) {
        return this.fetchRemoteContentAsync(path, broadcastRequest)
            .then((data: any) => {
                cacheOptions.store && this._store.set(storeKey, CacheWrapper(data));
                return data;
            });
    }

    fetchRemoteContentAsync(path: string, broadcastRequest: boolean) {
        return new Promise((resolve, reject) => {
            let req = request.get(path)
                .end((err, res) => {
                    if (err) reject(err);
                    else if (!res.ok) reject(res);
                    else resolve(res.body);
                });
             broadcastRequest && this.emit(this.requestStartEventName, req);
        });
    }
}