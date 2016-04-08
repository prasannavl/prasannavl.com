import { IStorageAsync, IStorageSync, TryGetOrSetResult, TryGetResult } from "./Storage";
import { passthrough, passthroughPromiseResolution, createKeyNotFoundError, StaticCache, PromiseFactory } from "./utils";

/**
 * Note: Keep implementation of IStorageSync and IStorageAsync compeltely isolated
 * so that it can be separated out into each its own class later, if required.
 */
export class BrowserStore implements IStorageSync<string>, IStorageAsync<string> {
    private _storage: Storage;

    constructor(storage: Storage) {
        this._storage = storage;
    }

    exists(key: string) {
        const val = this._storage.getItem(key) as string;
        return val !== null;
    }

    get(key: string) {
        const val = this._storage.getItem(key) as string;
        if (val === null) throw createKeyNotFoundError();
        return val;
    }

    set(key: string, value: string) {
        this._storage.setItem(key, value);
    }

    remove(key: string) {
        this._storage.removeItem(key);
    }

    clear() {
        this._storage.clear();
    }

    tryGet(key: string): TryGetResult<string> {
        const val = this._storage.getItem(key) as string;
        if (val === null) return StaticCache.TryGetResultFalseNull as TryGetResult<string>;
        return { exists: true, result: val };
    }

    tryGetOrSet(key: string, value: string, onBeforeSetValue = passthrough): TryGetOrSetResult<string> {
        const val = this._storage.getItem(key) as string;
        if (val !== null) return { isNew: false, result: val };
        const finalVal = onBeforeSetValue(val);
        this._storage.setItem(key, finalVal);
        return { isNew: true, result: finalVal };
    }

    existsAsync(key: string) {
        const val = this._storage.getItem(key) as string;
        return val !== null ? PromiseFactory.PromiseTrue : PromiseFactory.PromiseFalse;
    }

    getAsync(key: string) {
        const val = this._storage.getItem(key) as string;
        if (val === null) throw createKeyNotFoundError();
        return Promise.resolve(val);
    }

    setAsync(key: string, value: string) {
        this._storage.setItem(key, value);
        return PromiseFactory.PromiseEmpty;
    }

    removeAsync(key: string) {
        this._storage.removeItem(key);
        return PromiseFactory.PromiseEmpty;
    }

    clearAsync() {
        this._storage.clear();
        return PromiseFactory.PromiseEmpty;
    }

    tryGetAsync(key: string): Promise<TryGetResult<string>> {
        const val = this._storage.getItem(key) as string;
        if (val === null) return StaticCache.TryGetResultFalseNullPromise;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSetAsync(key: string, value: string, onBeforeSetValueAsync = passthroughPromiseResolution): Promise<TryGetOrSetResult<string>> {
        const val = this._storage.getItem(key) as string;
        if (val !== null) return Promise.resolve({ isNew: false, result: val });
        return onBeforeSetValueAsync(value).then(v => {
            this._storage.setItem(key, v);
            return { isNew: true, result: v };
        });
    }
}

export class LocalStorageStore extends BrowserStore {
    constructor() {
        super(localStorage);
    }
}

export class SessionStorageStore extends BrowserStore {
    constructor() {
        super(sessionStorage);
    }
}