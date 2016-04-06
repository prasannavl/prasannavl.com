import { IStorage, TryGetOrSetResult, TryGetResult } from "./Storage";
import { PromiseFactory } from "./PromiseFactory";
import { onBeforeSetValuePassthrough } from "./utils";

export class JsonDecorator<T> implements IStorage<T | string> {
    private _storage: IStorage<string>;

    constructor(storage: IStorage<string>) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string): Promise<T> {
        const val = this._storage.get(key);
        return val.then(x => JSON.parse(x) as T);
    }

    set(key: string, value: T) {
        const val = JSON.stringify(value);
        return this._storage.set(key, val);
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string): Promise<TryGetResult<T>> {
        const val = this._storage.tryGet(key);
        return val.then((x) => {
            let res = x.result;
            if (x.exists) {
                return { result: JSON.parse(res) as T, exists: true };
            } else {
                return PromiseFactory.PromiseExistsFalseResultNull;
            }
        });
    }

    tryGetOrSet(key: string, value: T, onSetValue = onBeforeSetValuePassthrough): Promise<TryGetOrSetResult<T>> {
        let newOnSetFunc = () => onSetValue(JSON.stringify(value));
        return this._storage.tryGetOrSet(key, value as any, newOnSetFunc)
            .then(x => { return { isNew: x.isNew, result: JSON.parse(x.result) }; });
    }
}