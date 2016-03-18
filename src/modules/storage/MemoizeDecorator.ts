import { IStorage } from "./Storage";
import { PromiseTrue } from "./StaticCache";

export class MemoizeDecorator implements IStorage {
    private _storage: IStorage;
    private _cacheMap: Map<string, any>;

    constructor(storage: IStorage) {
        this._storage = storage;
        this._cacheMap = new Map<string, any>();
    }

    exists(key: string) {
        if (this._cacheMap.has(key))
            return PromiseTrue;
        return this._storage.exists(key);
    }

    get(key: string) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve(cached);
        return this._storage.get(key);
    }

    set(key: string, value: any) {
        return this._storage.set(key, value)
            .then(x => this._cacheMap.set(key, value));
    }

    remove(key: string) {
        return this._storage.remove(key)
            .then(x => this.clearCache(key));
    }

    clear() {
        this._cacheMap.clear();
        return this._storage.clear();
    }

    tryGet(key: string) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ exists: true, result: cached });
        return this._storage.tryGet(key)
            .then(x => { this._cacheMap.set(key, x.result); return x; });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ isNew: false, result: cached });
        return this._storage.tryGetOrSet(key, value, onSetValue)
            .then(x => { this._cacheMap.set(key, x.result); return x; });
    }

    clearCache(key: string) {
        if (key === undefined) this._cacheMap.clear();
        else this._cacheMap.delete(key);
    }
}