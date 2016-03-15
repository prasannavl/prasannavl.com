export function displayNameFixup<T>(Component: T) {
    const klassDefn = Component as any as ObjectConstructor;
    const klass = class extends klassDefn {
        static displayName = klassDefn.name;
    } as any;

    return klass as T;
}

export function reverseArray(arr: any[]) {
    let len = arr.length;
    let res: any = new Array(len);
    let maxIndex = len - 1;
    for (let i = 0; i < len; i++) {
        res[i] = arr[maxIndex - i];
    }
    return res;
}