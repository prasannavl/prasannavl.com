import { ContentResolver, ContentResolution } from "./ContentResolver";

export interface IHeadlessContentManager {
    resolve(pathname: string): ContentResolution;
    getComponentForResolution(resolution: ContentResolution): JSX.Element;
    getComponent(pathname: string): JSX.Element;
    getContentForResolution(resolution: ContentResolution): any;
    getContent(path: string): any;
}

export class HeadlessContentManager {
    private _resolver: ContentResolver;

    constructor(resolver: ContentResolver) {
        this._resolver = resolver;
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
