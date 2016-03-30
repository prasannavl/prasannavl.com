import { IStorage } from "./Storage";
import { PromiseFactory } from "./PromiseFactory";

export class MemoryStore implements IStorage {
    private _store: any = {};

    exists(key: string) {
        const val = this._store[key];
        if (val === undefined) return PromiseFactory.PromiseFalse;
        return PromiseFactory.PromiseTrue;
    }

    get(key: string) {
        const val = this._store[key];
        if (val === undefined) return Promise.reject(new Error("Key not found"));
        return Promise.resolve(val);
    }

    set(key: string, value: any) {
        this._store[key] = value;
        return PromiseFactory.PromiseEmpty;
    }

    remove(key: string) {
        delete this._store[key];
        return PromiseFactory.PromiseEmpty;
    }

    clear() {
        this._store = {};
        return PromiseFactory.PromiseEmpty;
    }

    tryGet(key: string) {
        const val = this._store[key];
        if (val === undefined) return PromiseFactory.PromiseExistsFalseResultNull;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        const existing = this._store[key];
        if (existing !== undefined) return Promise.resolve({ isNew: false, result: existing });

        return onSetValue(value)
            .then(v => { this._store[key] = v; return { isNew: true, result: v }; });
    }
}