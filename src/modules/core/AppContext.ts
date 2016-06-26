import { IServiceProvider, ServiceProviderFactory } from "./ServiceProvider";
import { IRendererState, RendererStateFactory } from "./RendererState";
import { EventEmitter } from "events";

export interface IAppContext {
    services: IServiceProvider; 
    state: any;
    events: EventEmitter; 
}

export class AppContext implements IAppContext {
    services: IServiceProvider;
    events: EventEmitter;
    state: any;

    constructor(services: IServiceProvider) {
        this.services = services;
        this.state = {};
        this.events = new EventEmitter();
    }
}

export class AppContextFactory {
    static create() {
        return new AppContext(ServiceProviderFactory.create());
    }
}