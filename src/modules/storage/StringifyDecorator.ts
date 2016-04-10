import { IStorage, IStorageSync, IStorageAsync, TryGetOrSetResult, TryGetResult } from "./Storage";
import { passthrough, passthroughPromiseResolution, createKeyNotFoundError, StaticCache, PromiseFactory } from "./utils";

/**
 * Note: Keep implementation of IStorageSync and IStorageAsync completely isolated
 * so that it can be separated out into each its own class later, if required.
 */
export class StringifyDecorator<T> implements IStorageSync<any> {
    private _storage: IStorage<string>;

    constructor(storage: IStorage<string>) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string) {
        const val = this._storage.get(key);
        return val.toString();
    }

    set(key: string, value: T) {
        const val = value.toString();
        this._storage.set(key, val);
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string): TryGetResult<string> {
        const res = this._storage.tryGet(key);
        if (res.exists) {
            return { exists: true, result: res.result.toString() };
        }
        return StaticCache.TryGetResultFalseNull as TryGetResult<string>;
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = passthrough): TryGetOrSetResult<string> {
        const newOnSetFunc = () => onBeforeSetValue(value.toString());
        const val = this._storage.tryGetOrSet(key, value as any, newOnSetFunc);
        return { isNew: val.isNew, result: value.toString() };
    }

    existsAsync(key: string) {
        return this._storage.existsAsync(key);
    }

    getAsync(key: string): Promise<string> {
        return this._storage.getAsync(key).then(x => x.toString());
    }

    setAsync(key: string, value: T) {
        return this._storage.setAsync(key, value.toString() as any);
    }

    removeAsync(key: string) {
        return this._storage.removeAsync(key);
    }

    clearAsync() {
        return this._storage.clearAsync();
    }

    tryGetAsync(key: string): Promise<TryGetResult<string>> {
        return this._storage.tryGetAsync(key).then(x => {
            if (x.exists) {
                x.result = x.toString();
            }
            return x;
        });
    }

    tryGetOrSetAsync(key: string, value: T, onBeforeSetValue = passthroughPromiseResolution): Promise<TryGetOrSetResult<string>> {
        let newOnSetFunc = () => onBeforeSetValue(value.toString());
        return this._storage.tryGetOrSetAsync(key, value as any, newOnSetFunc)
            .then(x => { return { isNew: x.isNew, result: x.result.toString() }; });
    }
}