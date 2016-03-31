import request from "superagent";
import { EventEmitter } from "events";
import { IStorage } from "../storage/Storage";
import { ContentResolver } from "./ContentResolver";

export class DomContentManager extends EventEmitter {
    contentEventName = "content";
    pathKeyPrefix = "_@#_";

    private _store: IStorage;
    private _resolver: ContentResolver;

    constructor(resolver: ContentResolver, store: IStorage) {
        super();
        this._store = store;
        this._resolver = resolver;
    }

    setPath(pathname: string) {
        let resolved = this._resolver.resolve(pathname);
        if (resolved.path !== null) {
            this.getContentAsync(resolved.path)
                .then(x => this.emit(this.contentEventName, resolved.factory(x)));
        } else {
            this.emit(this.contentEventName, resolved.factory(null));
        }
    }

    getContentAsync(path: string) {
        let storeKey = this.pathKeyPrefix + path;
        return this._store.tryGet(storeKey)
            .then(x => {
                if (x.exists) {
                    return x.result;
                } else {
                    return this.fetchRemoteContentAsync(path)
                        .then(x => { this._store.set(storeKey, x); return x; });
                }
            });
    }

    fetchRemoteContentAsync(path: string) {
        return new Promise((resolve, reject) => {
            request.get(path)
                .end((err, res) => {
                    if (err) reject(err);
                    else resolve(res.body);
                });
        });
    }
}