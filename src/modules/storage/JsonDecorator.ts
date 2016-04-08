import { IStorage, IStorageSync, IStorageAsync, TryGetOrSetResult, TryGetResult } from "./Storage";
import { passthrough, passthroughPromiseResolution, createKeyNotFoundError, StaticCache, PromiseFactory } from "./utils";

/**
 * Note: Keep implementation of IStorageSync and IStorageAsync compeltely isolated
 * so that it can be separated out into each its own class later, if required.
 */
export class JsonDecorator<T> implements IStorageSync<T | string> {
    private _storage: IStorage<string>;

    constructor(storage: IStorage<string>) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string) {
        const val = this._storage.get(key);
        return JSON.parse(val) as T;
    }

    set(key: string, value: T) {
        const val = JSON.stringify(value);
        this._storage.set(key, val);
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string): TryGetResult<T> {
        const res = this._storage.tryGet(key);
        if (res.exists) {
            return { exists: true, result: JSON.parse(res.result) };
        }
        return StaticCache.TryGetResultFalseNull as TryGetResult<T>;
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = passthrough): TryGetOrSetResult<T> {
        const newOnSetFunc = () => onBeforeSetValue(JSON.stringify(value));
        const val = this._storage.tryGetOrSet(key, value as any, newOnSetFunc);
        return { isNew: val.isNew, result: JSON.parse(val.result) };
    }


    existsAsync(key: string) {
        return this._storage.existsAsync(key);
    }

    getAsync(key: string): Promise<T> {
        const val = this._storage.getAsync(key);
        return val.then(x => JSON.parse(x) as T);
    }

    setAsync(key: string, value: T) {
        const val = JSON.stringify(value);
        return this._storage.setAsync(key, val);
    }

    removeAsync(key: string) {
        return this._storage.removeAsync(key);
    }

    clearAsync() {
        return this._storage.clearAsync();
    }

    tryGetAsync(key: string): Promise<TryGetResult<T>> {
        const val = this._storage.tryGetAsync(key);
        return val.then((x) => {
            const res = x.result;
            if (x.exists) {
                return { result: JSON.parse(res) as T, exists: true };
            } else {
                return StaticCache.TryGetResultFalseNullPromise;
            }
        });
    }

    tryGetOrSetAsync(key: string, value: T, onBeforeSetValueAsync = passthroughPromiseResolution): Promise<TryGetOrSetResult<T>> {
        const newOnSetFunc = () => onBeforeSetValueAsync(JSON.stringify(value));
        return this._storage.tryGetOrSetAsync(key, value as any, newOnSetFunc)
            .then(x => { return { isNew: x.isNew, result: JSON.parse(x.result) }; });
    }
}