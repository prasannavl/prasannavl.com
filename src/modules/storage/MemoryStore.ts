import { IStorage } from "./Storage";
import { PromiseTrue, PromiseFalse, PromiseExistsFalse, PromiseEmpty, PromiseKeyNotFoundError } from "./StaticCache";

export class MemoryStore implements IStorage {
    private _store: any = {};

    exists(key: string) {
        const val = this._store[key];
        if (val === undefined) return PromiseFalse;
        return PromiseTrue;
    }

    get(key: string) {
        const val = this._store[key];
        if (val === undefined) return PromiseKeyNotFoundError;
        return Promise.resolve(val);
    }

    set(key: string, value: any) {
        this._store[key] = value;
        return PromiseEmpty;
    }

    remove(key: string) {
        delete this._store[key];
        return PromiseEmpty;
    }

    clear() {
        this._store = {};
        return PromiseEmpty;
    }

    tryGet(key: string) {
        const val = this._store[key];
        if (val === undefined) return PromiseExistsFalse;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        const existing = this._store[key];
        if (existing !== undefined) return Promise.resolve({ isNew: false, result: existing });

        return onSetValue(value)
            .then(v => { this._store[key] = v; return { isNew: true, result: v }; });
    }
}