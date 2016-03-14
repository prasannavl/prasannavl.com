export const PromiseEmpty = Promise.resolve();
export const PromiseTrue = Promise.resolve(true);
export const PromiseFalse = Promise.resolve(false);
export const PromiseExistsFalse = Promise.resolve({ exists: false, result: null });
export const PromiseKeyNotFoundError = Promise.reject(new Error("Key not found"));