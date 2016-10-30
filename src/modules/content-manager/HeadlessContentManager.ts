import { IHeadlessContentManager } from "./ContentManager";
import { ContentResolver, ContentResolution } from "./ContentResolver";

export class HeadlessContentManager implements IHeadlessContentManager {
    private _resolver: ContentResolver;

    constructor(resolver: ContentResolver) {
        this._resolver = resolver;
    }

    getResolver() {
        return this._resolver;
    }

    resolve(pathname: string) {
        return this._resolver.resolve(pathname);
    }

    getComponentForResolution(resolution: ContentResolution) {
        let content = this.getContentForResolution(resolution);
        return resolution.factory(content);
    }

    getContentForResolution(resolution: ContentResolution) {
        let content = null as any;
        if (resolution.contentPath !== null) {
            content = this.getContent(resolution.contentPath);
        }
        return content;
    }

    getComponent(pathname: string) {
        let resolved = this._resolver.resolve(pathname);
        return this.getComponentForResolution(resolved);
    }

    getContent(path: string) {
        return require("../../../static" + path);
    }
}
