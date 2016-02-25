import { IRouteHandlerDescriptor, IRouteProcessor } from "./RoutingSpec";
import { ITitleComponent } from "./TitleSpec";

export interface IClientPartialState {
    renderSurface: HTMLElement | string;
}

export interface IServerState {
    statusCode: number;
    error: any;
    data: string;
    cssModules: [CssModule];
    htmlConfig: any;
}

export interface IAppContext {
    history: HistoryModule.History;
    routes: any;
    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routeHandlerDescriptor: IRouteHandlerDescriptor;
    routeProcessor: IRouteProcessor;
    state: IClientPartialState | IServerState;
}

export interface IContextManager {
    createContext(): IAppContext;
    render(context: IAppContext, url?: string): void;
}

export class AppContext implements IAppContext {

    history: HistoryModule.History;
    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routes: any;
    routeHandlerDescriptor: IRouteHandlerDescriptor;
    routeProcessor: IRouteProcessor;
    state: IClientPartialState | IServerState;

    constructor(
        history: HistoryModule.History,
        titleComponent: ITitleComponent,
        routes: any,
        applyCss: ApplyStyleFunction,
        routeProcessor: IRouteProcessor,
        routeHandlerDescriptor: IRouteHandlerDescriptor,
        state: IClientPartialState | IServerState) {

        this.history = history;
        this.title = titleComponent;
        this.routes = routes;
        this.applyCss = applyCss;
        this.routeProcessor = routeProcessor;
        this.routeHandlerDescriptor = routeHandlerDescriptor;
        this.state = state;
    }
}