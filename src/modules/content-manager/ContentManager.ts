import { EventEmitter } from "events";
import { ContentResolution, ContentResolver } from "./ContentResolver";

// Note: These two interfaces are very different from one another
// even though semantically they should ideally be similar. This is because
// React doesn't support async render on the server side. 
// It is a workaround so that IHeadlessContentManager does everything
// synchronously. 
// 
// Once React can provide a reasonable way to do async render without,
// hacks, these interfaces can be made coherent. 
// 
// A further factory design which modularizes it even further will actually
// fragment the apis futher more pointlessly.

export interface IDomContentManager extends EventEmitter {
    contentReadyEventName: string;
    requestStartEventName: string;
    backgroundRequestStartEventName: string;
    flushInlineCacheAsync(pathKey: string): Promise<void>;
    queuePath(pathname: string, cacheOptions?: CacheOptions): void;
    getContentAsync(path: string, cacheOptions?: CacheOptions): Promise<any>;
    fetchRemoteAndStoreAsync(path: string, storeKey: string, cacheOptions: CacheOptions, broadcastRequest?: boolean): Promise<any>;
    fetchRemoteContentAsync(path: string, broadcastRequest: boolean): Promise<any>;
}

export interface IHeadlessContentManager {
    resolve(pathname: string): ContentResolution;
    getComponentForResolution(resolution: ContentResolution): JSX.Element;
    getComponent(pathname: string): JSX.Element;
    getContentForResolution(resolution: ContentResolution): any;
    getContent(path: string): any;
}

export interface CacheOptions {
    check: boolean;
    store: boolean;
}