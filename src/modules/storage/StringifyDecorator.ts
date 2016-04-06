import { IStorage, TryGetOrSetResult, TryGetResult } from "./Storage";
import { onBeforeSetValuePassthrough } from "./utils";

export class StringifyDecorator<T> implements IStorage<any> {
    private _storage: IStorage<any>;

    constructor(storage: IStorage<any>) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string): Promise<string> {
        return this._storage.get(key).then(x => x.toString());
    }

    set(key: string, value: T) {
        return this._storage.set(key, value.toString());
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string): Promise<TryGetResult<string>> {
        return this._storage.tryGet(key).then(x => {
            if (x.exists) {
                x.result = x.toString();
            }
            return x;
        });
    }

    tryGetOrSet(key: string, value: T, onBeforeSetValue = onBeforeSetValuePassthrough): Promise<TryGetOrSetResult<string>> {
        let newOnSetFunc = () => onBeforeSetValue((value as any).toString());
        return this._storage.tryGetOrSet(key, value, newOnSetFunc)
            .then(x => { return { isNew: x.isNew, result: x.result.toString() }});
    }
}