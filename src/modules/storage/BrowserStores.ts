import { IStorage, TryGetOrSetResult, TryGetResult } from "./Storage";
import { PromiseFactory } from "./PromiseFactory";
import { onBeforeSetValuePassthrough } from "./utils";

export class BrowserStore implements IStorage<string> {
    private _storage: Storage;

    constructor(storage: Storage) {
        this._storage = storage;
    }

    exists(key: string) {
        const val = this._storage.getItem(key) as string;
        if (val === null) return PromiseFactory.PromiseFalse;
        return PromiseFactory.PromiseTrue;
    }

    get(key: string): Promise<string | Error> {
        const val = this._storage.getItem(key) as string;
        if (val === null) return PromiseFactory.createKeyNotFoundError();
        return Promise.resolve(val);
    }

    set(key: string, value: string) {
        this._storage.setItem(key, value);
        return PromiseFactory.PromiseEmpty;
    }

    remove(key: string) {
        this._storage.removeItem(key);
        return PromiseFactory.PromiseEmpty;
    }

    clear() {
        this._storage.clear();
        return PromiseFactory.PromiseEmpty;
    }

    tryGet(key: string): Promise<TryGetResult<string>> {
        const val = this._storage.getItem(key) as string;
        if (val === null) return PromiseFactory.PromiseExistsFalseResultNull;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSet(key: string, value: string, onBeforeSetValue = onBeforeSetValuePassthrough): Promise<TryGetOrSetResult<string>> {
        const val = this._storage.getItem(key) as string;
        if (val !== null) return Promise.resolve({ isNew: false, result: val });

        return onBeforeSetValue(value).then(v => {
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