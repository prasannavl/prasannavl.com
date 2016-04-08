import { TryGetOrSetResult, TryGetResult } from "./Storage";

export function passthroughPromiseResolution<T>(value: T) {
    return Promise.resolve(value);
}

export function passthrough<T>(value: T) {
    return value;
}

export function createKeyNotFoundError() {
    return new Error("Key not found");
}

export function createTryGetNull<T>(exists: boolean): TryGetResult<T>  {
    return { exists, result: null };
}

export class StaticCache {
    static TryGetResultFalseNull = createTryGetNull(false);
    static TryGetResultFalseNullPromise = Promise.resolve(StaticCache.TryGetResultFalseNull);
}

export class PromiseFactory {
    static PromiseEmpty = Promise.resolve();
    static PromiseTrue = Promise.resolve(true);
    static PromiseFalse = Promise.resolve(false);
}