import { IStorage } from "./Storage";

export class JsonDecorator implements IStorage {
    private _storage: IStorage;

    constructor(storage: IStorage) {
        this._storage = storage;
    }

    exists(key: string) {
        return this._storage.exists(key);
    }

    get(key: string) {
        const val = this._storage.get(key);
        return val.then(x => JSON.parse(x));
    }

    set(key: string, value: any) {
        const val = JSON.stringify(value);
        return this._storage.set(key, val);
    }

    remove(key: string) {
        return this._storage.remove(key);
    }

    clear() {
        return this._storage.clear();
    }

    tryGet(key: string) {
        const val = this._storage.tryGet(key);
        return val.then(x => {
            let res: any = x.result;
            if (x.exists) {
                res = JSON.parse(res);
                x.result = res;
            }
            return x;
        });
    }

    tryGetOrSet(key: string, value: any, onSetValue = (value: any) => Promise.resolve(value)) {
        let newOnSetFunc = () => onSetValue(JSON.stringify(value));
        return this._storage.tryGetOrSet(key, value, newOnSetFunc);
    }
}