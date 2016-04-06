import { IStorage } from "../storage/Storage";
import { IDomContentManager, IHeadlessContentManager } from "./ContentManager";
import { ContentResolver } from "./ContentResolver";

export class ContentManagerFactory {
    static create(localStore: IStorage<any>, sessionStore: IStorage<any>): IDomContentManager | IHeadlessContentManager {
        let resolver = new ContentResolver();
        if (__DOM__) {
            let DomContentManager = require("./DomContentManager").DomContentManager;;
            return new DomContentManager(resolver, localStore, sessionStore) as IDomContentManager;
        } else {
            let HeadlessContentManager = require("./HeadlessContentManager").HeadlessContentManager;
            return new HeadlessContentManager(resolver) as IHeadlessContentManager;
        }
    }
}