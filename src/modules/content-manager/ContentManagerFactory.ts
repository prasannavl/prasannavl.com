import { IStorage } from "../storage/Storage";
import { IDomContentManager, IHeadlessContentManager } from "./ContentManager";
import { ContentResolver } from "./ContentResolver";

export class ContentManagerFactory {
    static create(): IDomContentManager | IHeadlessContentManager {
        let resolver = new ContentResolver();
        if (__DOM__) {
            let DomContentManager = require("./DomContentManager").DomContentManager;
            let LocalStorageStore = require("../storage/BrowserStores").LocalStorageStore;
            let JsonDecorator = require("../storage/JsonDecorator").JsonDecorator;
            let finalStore = new JsonDecorator(new LocalStorageStore());
            return new DomContentManager(resolver, finalStore) as IDomContentManager;
        } else {
            let HeadlessContentManager = require("./HeadlessContentManager").HeadlessContentManager;
            return new HeadlessContentManager(resolver) as IHeadlessContentManager;
        }
    }
}