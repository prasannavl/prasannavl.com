import request from "superagent";
import { IStorage, TryGetResult } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";
import { EventEmitter } from "events";
import { PromiseFactory } from "../storage/PromiseFactory";
import { IDomContentManager, CacheOptions } from "./ContentManager";
import moment from "moment";

export interface ICacheWrapper {
    data: any;
    lastSyncDate: number;
    appVersion: string;
    sessionTag: number;
}

export class DomContentManager extends EventEmitter implements IDomContentManager {
    contentReadyEventName = "contentready";
    requestStartEventName = "requeststart";
    backgroundRequestStartEventName = "backgroundrequeststart";

    pathKeyPrefix = ContentResolver.DefaultPathKeyPrefix;

    private _lastKnownPathName: string = null;
    private _inlineCacheFlushed = false;
    private _sessionTag: number;

    constructor(private _resolver: ContentResolver,
        private _localStore: IStorage<ICacheWrapper>,
        sessionStore: IStorage<any>) {
        super();
        this.tagSession(sessionStore);
    }

    tagSession(sessionStore: IStorage<any>) {
        const contentSessionTagKey = "contentTag";
        // Note: With DOM, this is always synchronous, or further logic is required.
        sessionStore.tryGetOrSet(contentSessionTagKey, Date.now())
            .then(x => this._sessionTag = x.result);
    }

    createCache(data: any, lastSyncDate: number = Date.now()) {
        return { data, lastSyncDate, appVersion: __app_version__, sessionTag: this._sessionTag };
    }

    flushInlineCacheAsync(pathKey: string) {
        if (!this._inlineCacheFlushed) {
            this._inlineCacheFlushed = true;
            let data = (window as any)[ContentResolver.InlineDataCacheKey];
            if (data != null) {
                (window as any)[ContentResolver.InlineDataCacheKey] = null;
                return this._localStore.set(pathKey, this.createCache(data));
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
            .then(() => this._localStore.tryGet(storeKey))
            .then(x => {
                if (this.isCacheValid(path, storeKey, x, cacheOptions)) {
                    // queue a background update for future , but return from cache
                    // TODO: later once a last update date is added, check to see if it really
                    // was a new version, and if so, notify user.
                    setTimeout(() => this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions), 1000);
                    return x.result.data;
                }
                return this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions, false);
            });
    }

    isCacheValid(path: string, storeKey: string, wrappedResult: TryGetResult<ICacheWrapper>, cacheOptions: CacheOptions) {
        // Check cache options, and also make sure the data is from the current session.
        // If everything indicates the current cache can be used, proceed ahead.
        // TODO: check appversion (Note: Without app version check, later session tagged data
        // could potentially break, if the data model is incompatible.)
        let result = wrappedResult.result;
        if (cacheOptions.check &&
            wrappedResult.exists &&
            result.sessionTag >= this._sessionTag) {
            let cache = wrappedResult.result;
            let lastSyncDateRaw = cache.lastSyncDate;
            if (lastSyncDateRaw) {
                let lastSyncDate = moment(lastSyncDateRaw);
                // if last check was less than a day.
                let freshFrom = moment().subtract({ days: 1 });
                if (lastSyncDate.diff(freshFrom) > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    fetchRemoteAndStoreAsync(path: string, storeKey: string, cacheOptions: CacheOptions, isBackgroundRequest = true) {
        return this.fetchRemoteContentAsync(path, isBackgroundRequest)
            .then((data: any) => {
                cacheOptions.store && this._localStore.set(storeKey, this.createCache(data));
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