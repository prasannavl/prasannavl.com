export class PromiseFactory {
    static PromiseEmpty = Promise.resolve();
    static PromiseTrue = Promise.resolve(true);
    static PromiseFalse = Promise.resolve(false);
    static PromiseExistsFalseResultNull = Promise.resolve({ exists: false, result: null });
    static createKeyNotFoundError() {
        return Promise.reject<Error>(new Error("Key not found"));
    }
}