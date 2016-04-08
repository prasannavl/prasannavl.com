import { IStorage, IStorageSync, IStorageAsync, TryGetOrSetResult, TryGetResult } from "./Storage";
import { passthrough, passthroughPromiseResolution, createKeyNotFoundError, StaticCache, PromiseFactory } from "./utils";

/**
 * Note: Keep implementation of IStorageSync and IStorageAsync compeltely isolated
 * so that it can be separated out into each its own class later, if required.
 */
export class MemoizeDecorator<T> implements IStorageSync<T>, IStorageAsync<T> {
    private _storage: IStorage<T>;
    private _cacheMap: Map<string, T>;

    constructor(storage: IStorage<T>) {
        this._storage = storage;
        this._cacheMap = new Map<string, T>();
    }

    exists(key: string) {
        if (this._cacheMap.has(key))
            return true;
        return this._storage.exists(key);
    }

    get(key: string) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return cached;
        return this._storage.get(key);
    }

    set(key: string, value: T) {
        this._storage.set(key, value);
        this._cacheMap.set(key, value);
    }

    remove(key: string) {
        this._storage.remove(key);
        this.clearCache(key);
    }

    clear() {
        this._storage.clear();
        this._cacheMap.clear();
    }

    tryGet(key: string): TryGetResult<T> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return { exists: true, result: cached };
        let res = this._storage.tryGet(key);
        if (res.exists) { this._cacheMap.set(key, res.result); }
        return res as TryGetResult<T>;
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = passthrough): TryGetOrSetResult<T> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return { isNew: false, result: cached };
        const res = this._storage.tryGetOrSet(key, value, onBeforeSetValue);
        this._cacheMap.set(key, res.result);
        return { isNew: res.isNew, result: res.result };
    }

    existsAsync(key: string) {
        if (this._cacheMap.has(key))
            return PromiseFactory.PromiseTrue;
        return this._storage.existsAsync(key);
    }

    getAsync(key: string) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve(cached);
        return this._storage.getAsync(key);
    }

    setAsync(key: string, value: T) {
        return this._storage.setAsync(key, value)
            .then(x => { this._cacheMap.set(key, value); });
    }

    removeAsync(key: string) {
        return this._storage.removeAsync(key)
            .then(x => this.clearCache(key));
    }

    clearAsync() {
        return this._storage.clearAsync()
            .then(x => this._cacheMap.clear());
    }

    tryGetAsync(key: string): Promise<TryGetResult<T>> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ exists: true, result: cached });
        return this._storage.tryGetAsync(key)
            .then((x: TryGetResult<T>) => { x.exists && this._cacheMap.set(key, x.result); return x; });
    }

    tryGetOrSetAsync(key: string, value: T, onBeforeSetValue = passthroughPromiseResolution): Promise<TryGetOrSetResult<T>> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ isNew: false, result: cached });
        return this._storage.tryGetOrSetAsync(key, value, onBeforeSetValue)
            .then((x: TryGetOrSetResult<T>) => { this._cacheMap.set(key, x.result); return x; });
    }

    clearCache(key: string) {
        if (key === undefined) this._cacheMap.clear();
        else this._cacheMap.delete(key);
    }
}