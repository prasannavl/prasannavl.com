export function displayNameFixup<T>(Component: T) {
    const klassDefn = Component as any as ObjectConstructor;
    const klass = class extends klassDefn {
        static displayName = klassDefn.name;
    } as any;

    return klass as T;
}

export function reverseArray(arr: any[]) {
    let res: any = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        res.push(arr[i]);
    }
    return res;
}