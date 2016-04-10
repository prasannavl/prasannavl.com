import { IStorageSync, IStorageAsync, TryGetOrSetResult, TryGetResult } from "./Storage";
import { passthroughPromiseResolution, PromiseFactory, passthrough, StaticCache, createKeyNotFoundError } from "./utils";

/**
 * Note: Keep implementation of IStorageSync and IStorageAsync completely isolated
 * so that it can be separated out into each its own class later, if required.
 */
export class MemoryStore<T> implements IStorageSync<T>, IStorageAsync<T> {
    private _store: any = {};

    exists(key: string) {
        const val = this._store[key] as T;
        return val !== undefined;
    }

    get(key: string) {
        const val = this._store[key] as T;
        if (val === undefined) throw createKeyNotFoundError();
        return val;
    }

    set(key: string, value: T) {
        this._store[key] = value;
    }

    remove(key: string) {
        delete this._store[key];
    }

    clear() {
        this._store = {};
    }

    tryGet(key: string): TryGetResult<T> {
        const val = this._store[key] as T;
        if (val === undefined) return StaticCache.TryGetResultFalseNull as TryGetResult<T>;
        return { exists: true, result: val };
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = passthrough): TryGetOrSetResult<T> {
        const val = this._store[key] as T;
        if (val !== null) return { isNew: false, result: val };
        let finalVal = onBeforeSetValue(val);
        this.set(key, finalVal);
        return { isNew: true, result: finalVal };
    }

    existsAsync(key: string) {
        const val = this._store[key] as T;
        if (val === undefined) return PromiseFactory.PromiseFalse;
        return PromiseFactory.PromiseTrue;
    }

    getAsync(key: string): Promise<T | Error> {
        const val = this._store[key] as T;
        if (val === undefined) return Promise.reject<Error>(new Error("Key not found"));
        return Promise.resolve(val);
    }

    setAsync(key: string, value: T) {
        this._store[key] = value;
        return PromiseFactory.PromiseEmpty;
    }

    removeAsync(key: string) {
        delete this._store[key];
        return PromiseFactory.PromiseEmpty;
    }

    clearAsync() {
        this._store = {};
        return PromiseFactory.PromiseEmpty;
    }

    tryGetAsync(key: string): Promise<TryGetResult<T>> {
        const val = this._store[key] as T;
        if (val === undefined) return StaticCache.TryGetResultFalseNullPromise;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSetAsync(key: string, value: T, onBeforeSetValueAsync = passthroughPromiseResolution): Promise<TryGetOrSetResult<T>> {
        const existing = this._store[key] as T;
        if (existing !== undefined) return Promise.resolve({ isNew: false, result: existing });
        return onBeforeSetValueAsync(value)
            .then(v => { this._store[key] = v; return { isNew: true, result: v }; });
    }
}