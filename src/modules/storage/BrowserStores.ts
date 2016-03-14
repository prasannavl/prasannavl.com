import { IStorage } from "./Storage";
import { PromiseTrue, PromiseFalse, PromiseExistsFalse, PromiseEmpty, PromiseKeyNotFoundError } from "./StaticCache";

export class BrowserStore implements IStorage {
    private _storage: Storage;

    constructor(storage: Storage) {
        this._storage = storage;
    }

    exists(key: string) {
        const val = this._storage.getItem(key);
        if (val === null) return PromiseFalse;
        return PromiseTrue;
    }

    get(key: string) {
        const val = this._storage.getItem(key);
        if (val === null) return PromiseKeyNotFoundError;
        return Promise.resolve(val);
    }

    set(key: string, value: any) {
        this._storage.setItem(key, value);
        return PromiseEmpty;
    }

    remove(key: string) {
        this._storage.removeItem(key);
        return PromiseEmpty;
    }

    clear() {
        this._storage.clear();
        return PromiseEmpty;
    }

    tryGet(key: string) {
        const val = this._storage.getItem(key);
        if (val === null) return PromiseExistsFalse;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        const val = this._storage.getItem(key);
        if (val !== null) return Promise.resolve({ isNew: false, result: val });

        return onSetValue(value).then(v => {
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