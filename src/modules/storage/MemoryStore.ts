import { IStorage, TryGetOrSetResult, TryGetResult } from "./Storage";
import { PromiseFactory } from "./PromiseFactory";
import { onBeforeSetValuePassthrough } from "./utils";

export class MemoryStore<T> implements IStorage<T> {
    private _store: any = {};

    exists(key: string) {
        const val = this._store[key] as T;
        if (val === undefined) return PromiseFactory.PromiseFalse;
        return PromiseFactory.PromiseTrue;
    }

    get(key: string): Promise<T | Error> {
        const val = this._store[key] as T;
        if (val === undefined) return Promise.reject<Error>(new Error("Key not found"));
        return Promise.resolve(val);
    }

    set(key: string, value: T) {
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

    tryGet(key: string): Promise<TryGetResult<T>> {
        const val = this._store[key] as T;
        if (val === undefined) return PromiseFactory.PromiseExistsFalseResultNull;
        return Promise.resolve({ exists: true, result: val });
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = onBeforeSetValuePassthrough): Promise<TryGetOrSetResult<T>> {
        const existing = this._store[key] as T;
        if (existing !== undefined) return Promise.resolve({ isNew: false, result: existing });

        return onBeforeSetValue(value)
            .then(v => { this._store[key] = v; return { isNew: true, result: v }; });
    }
}