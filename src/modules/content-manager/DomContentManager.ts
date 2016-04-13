import request from "superagent";
import { IStorage, TryGetResult } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";
import { EventEmitter } from "events";
import { IDomContentManager, CacheOptions } from "./ContentManager";
import moment from "moment";
import bluebird from "bluebird";

export interface ICacheWrapper {
    data: any;
    lastSyncDate: number;
    appVersion: string;
    sessionTag: number;
}

export class DomContentManager extends EventEmitter implements IDomContentManager {
    contentReadyEventName = "contentready";

    requestStartEventName = "requeststart";
    requestCompleteEventName = "requestcomplete";
    requestFailedEventName = "requestfailed";

    backgroundRequestStartEventName = "requestbackgroundstart";
    backgroundRequestCompleteEventName = "requestbackgroundcomplete";
    backgroundRequestFailedEventName = "requestbackgroundfailed";

    pathKeyPrefix = ContentResolver.DefaultPathKeyPrefix;

    private _lastKnownPathName: string = null;
    private _inlineCacheFlushed = false;
    private _sessionTag: number;
    private _appVersionMajor: number;
    private _appVersionMinor: number;
    private _pendingForegroundRequest: request.SuperAgentRequest;
    private _pendingBackgroundRequest: request.SuperAgentRequest;

    constructor(private _resolver: ContentResolver,
        private _localStore: IStorage<ICacheWrapper>,
        sessionStore: IStorage<any>) {
        super();
        let { major, minor } = this.getAppVersion(__app_version__);
        this._appVersionMajor = major;
        this._appVersionMinor = minor;
        this.tagSession(sessionStore);
    }

    getAppVersion(versionString: string) {
        let major = 0, minor = 0;
        if (versionString) {
            let v = versionString.split(".");
            if (v.length > 1) {
                major = Number(v[0]);
                minor = Number(v[1]);
            }
        }
        return { major, minor };
    }

    tagSession(sessionStore: IStorage<any>) {
        const contentSessionTagKey = "contentTag";
        this._sessionTag = sessionStore.tryGetOrSet(contentSessionTagKey, Date.now()).result;
    }

    createCache(data: any, lastSyncDate: number = Date.now()) {
        return { data, lastSyncDate, appVersion: __app_version__, sessionTag: this._sessionTag };
    }

    isDomPrerendered() {
        let flag = (window as any)[ContentResolver.IsPrerenderedDomKey];
        return flag ? true : false;
    }

    setDomPrerendered(value: boolean) {
        (window as any)[ContentResolver.IsPrerenderedDomKey] = value;
    }
    
    flushInlineCacheAsync(pathKey: string) {
        if (!this._inlineCacheFlushed) {
            this._inlineCacheFlushed = true;
            let data = (window as any)[ContentResolver.InlineDataCacheKey];
            if (data != null) {
                (window as any)[ContentResolver.InlineDataCacheKey] = null;
                let cache = this.createCache(data);
                return this._localStore.setAsync(pathKey, cache);
            }
        }
        return Promise.resolve();
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
            this._lastKnownPathName = pathname;            
            this.emit(this.contentReadyEventName, resolved.factory());
        }
    }

    getContentAsync(path: string, cacheOptions: CacheOptions = { check: false, store: false }) {
        let storeKey = this.pathKeyPrefix + path;
        return this.flushInlineCacheAsync(storeKey)
            .then(() => this._localStore.tryGetAsync(storeKey))
            .then(x => {
                if (this.isCacheValid(path, storeKey, x, cacheOptions)) {
                    // queue a background update for future , but return from cache
                    // TODO: later once a last update date is added, check to see if it really
                    // was a new version, and if so, notify user.
                    // Note: tracked background request 
                    setTimeout(() => this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions, true, false), 1000);
                    return x.result.data;
                }
                // Tracked foreground request
                return this.fetchRemoteAndStoreAsync(path, storeKey, cacheOptions, false, false);
            });
    }

    isCacheValid(path: string, storeKey: string, wrappedResult: TryGetResult<ICacheWrapper>, cacheOptions: CacheOptions) {
        let result = wrappedResult.result;
        if (cacheOptions.check &&
            wrappedResult.exists &&
            result.sessionTag >= this._sessionTag) {
            let cache = wrappedResult.result;
            let lastSyncDateRaw = cache.lastSyncDate;
            // Ensure data sanity for version.
            let { major, minor } = this.getAppVersion(cache.appVersion);
            if (major !== this._appVersionMajor) return false;
            if (minor < this._appVersionMinor) return false;
            // Ensure time sanity
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

    fetchRemoteAndStoreAsync(path: string,
        storeKey: string,
        cacheOptions: CacheOptions,
        isBackgroundRequest = true,
        isIsolated = true) {
        return this.fetchRemoteContentAsync(path, isBackgroundRequest, isIsolated)
            .then((data: any) => {
                cacheOptions.store && this._localStore.setAsync(storeKey, this.createCache(data));
                return data;
            });
    }

    fetchRemoteContentAsync(path: string, isBackgroundRequest: boolean, isIsolated = true) {
        let tracked = !isIsolated;
        return new Promise((resolve, reject) => {
            let req = request.get(path);
            if (tracked) {
                if (isBackgroundRequest) {
                    if (this._pendingBackgroundRequest) {
                        this._pendingBackgroundRequest.abort();
                        this.emit(this.backgroundRequestFailedEventName, this._pendingBackgroundRequest);                        
                    }
                } else {
                    if (this._pendingForegroundRequest) {
                        this._pendingForegroundRequest.abort();
                        this.emit(this.requestFailedEventName, this._pendingForegroundRequest);                        
                    }
                }
            }
            req.end((err, res) => {
                if (tracked) {
                    if (isBackgroundRequest) {
                        this._pendingBackgroundRequest = null;
                        if (err) this.emit(this.backgroundRequestFailedEventName, req)
                        else this.emit(this.backgroundRequestCompleteEventName, req);
                    }
                    else {
                        this._pendingForegroundRequest = null;
                        if (err) this.emit(this.requestFailedEventName, req)
                        else this.emit(this.requestCompleteEventName, req);                        
                    }
                }
                if (err) reject(err);
                else if (!res.ok) reject(res);
                else resolve(res.body);
            });

            if (tracked) {
                if (isBackgroundRequest) {
                    this.emit(this.backgroundRequestStartEventName, req);
                } else {
                    this.emit(this.requestStartEventName, req);
                }
            }
        });
    }
}