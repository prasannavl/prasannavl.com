export function onBeforeSetValuePassthrough<T>(value: T) {
    return Promise.resolve(value);
}