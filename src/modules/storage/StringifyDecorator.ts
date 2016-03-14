import { IStorage } from "./Storage";


export class StringifyDecorator implements IStorage {
    private _storage: IStorage;

    constructor(storage: IStorage) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string) {
        return this._storage.get(key).then(x => x.toString());
    }

    set(key: string, value: any) {
        return this._storage.set(key, value.toString());
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string) {
        return this._storage.tryGet(key).then(x => {
            if (x.exists) {
                x.result = x.toString();
            }
            return x;
        });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        let newOnSetFunc = () => onSetValue(value.toString());
        return this._storage.tryGetOrSet(key, value, newOnSetFunc);
    }
}