import { ContentResolver } from "./ContentResolver";

export class HeadlessContentManager {
    private _resolver: ContentResolver;

    constructor(resolver: ContentResolver) {
        this._resolver = resolver;
    }

    getComponent(pathname: string) {
        let resolved = this._resolver.resolve(pathname);
        let content = null as any;
        if (resolved.path !== null) {
            content = this.getContent(resolved.path);
        }
        return resolved.factory(content);
    }

    getContent(path: string) {
        return require("../../../static" + path);
    }
}
