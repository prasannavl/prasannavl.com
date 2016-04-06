import { IStorage, TryGetOrSetResult, TryGetResult } from "./Storage";
import { PromiseFactory } from "./PromiseFactory";
import { onBeforeSetValuePassthrough } from "./utils";

export class MemoizeDecorator<T> implements IStorage<T> {
    private _storage: IStorage<T>;
    private _cacheMap: Map<string, T>;

    constructor(storage: IStorage<T>) {
        this._storage = storage;
        this._cacheMap = new Map<string, T>();
    }

    exists(key: string) {
        if (this._cacheMap.has(key))
            return PromiseFactory.PromiseTrue;
        return this._storage.exists(key);
    }

    get(key: string) {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve(cached);
        return this._storage.get(key);
    }

    set(key: string, value: T) {
        return this._storage.set(key, value)
            .then(x => { this._cacheMap.set(key, value); });
    }

    remove(key: string) {
        return this._storage.remove(key)
            .then(x => this.clearCache(key));
    }

    clear() {
        this._cacheMap.clear();
        return this._storage.clear();
    }

    tryGet(key: string): Promise<TryGetResult<T>> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ exists: true, result: cached });
        return this._storage.tryGet(key)
            .then((x: TryGetResult<T>) => { this._cacheMap.set(key, x.result); return x; });
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = onBeforeSetValuePassthrough): Promise<TryGetOrSetResult<T>> {
        const cached = this._cacheMap.get(key);
        if (cached !== undefined) return Promise.resolve({ isNew: false, result: cached });
        return this._storage.tryGetOrSet(key, value, onBeforeSetValue)
            .then((x: TryGetOrSetResult<T>) => { this._cacheMap.set(key, x.result); return x; });
    }

    clearCache(key: string) {
        if (key === undefined) this._cacheMap.clear();
        else this._cacheMap.delete(key);
    }
}