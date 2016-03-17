import { IAppContext, AppContextFactory } from "../core/AppContext";

export interface IContextManager {
    createContext(): IAppContext;
    configureContext(context: IAppContext, options: any): void;
    render(context: IAppContext, url?: string): void;
}

export class ContextManagerFactory {
    static create() {
        let factory: Core.IFactory<IContextManager> = null;
        if (__DOM__) {
            factory = require("../dom-adapter/ContextManager").ContentManagerFactory;
        } else {
            factory = require("../headless-adapter/ContextManager").ContentManagerFactory;
        }
        return factory.create();
    }
}