export function displayNameFixup<T>(Component: T) {
    const klassDefn = Component as any as ObjectConstructor;
    const klass = class extends klassDefn {
        static displayName = klassDefn.name;
    } as any;

    return klass as T;
}
