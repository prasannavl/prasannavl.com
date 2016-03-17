import { IServiceProvider, ServiceProviderFactory } from "./ServiceProvider";
import { IHistoryContext } from "history-next";
import { IRendererState, RendererStateFactory } from "./RendererState";

export interface IAppContext {
    historyContext: IHistoryContext;
    services: IServiceProvider;
    state: any;
}

export class AppContext implements IAppContext {
    services: IServiceProvider;
    historyContext: IHistoryContext;
    state: any;

    constructor(services: IServiceProvider) {
        this.services = services;
        this.state = {};
    }
}

export class AppContextFactory {
    static create() {
        return new AppContext(ServiceProviderFactory.create());
    }
}