import request from "superagent";
import { EventEmitter } from "events";
import { IStorage } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";
import { PromiseFactory } from "../storage/PromiseFactory";

export interface CacheOptions {
    check: boolean;
    store: boolean;
}

export class DomContentManager extends EventEmitter {
    contentEventName = "content";
    requestStartEventName = "requeststart";
    pathKeyPrefix = ContentResolver.DefaultPathKeyPrefix;

    private _store: IStorage;
    private _resolver: ContentResolver;
    private _lastKnownPathName: string = null;
    private _inlineCacheFlushed = false;

    constructor(resolver: ContentResolver, store: IStorage) {
        super();
        this._store = store;
        this._resolver = resolver;
    }

    flushInlineCacheAsync(path: string) {
        if (__DOM__) {
            if (!this._inlineCacheFlushed) {
                this._inlineCacheFlushed = true;
                let data = (window as any)[ContentResolver.InlineDataCacheKey];
                if (data != null) {
                    (window as any)[ContentResolver.InlineDataCacheKey] = null;
                    return this._store.set(this.pathKeyPrefix + path, data);
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
        return this.flushInlineCacheAsync(path)
            .then(() => this._store.tryGet(storeKey))
            .then(x => {
                if (cacheOptions.check && x.exists) {
                    return x.result;
                } else {
                    return this.fetchRemoteContentAsync(path)
                        .then(x => { cacheOptions.store && this._store.set(storeKey, x); return x; });
                }
            });
    }

    fetchRemoteContentAsync(path: string) {
        return new Promise((resolve, reject) => {
            let req = request.get(path)
                .end((err, res) => {
                    if (err) reject(err);
                    else if (!res.ok) reject(res);
                    else resolve(res.body);
                });
             this.emit(this.requestStartEventName, req);
        });
    }
}