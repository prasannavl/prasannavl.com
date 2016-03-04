import { IRouteProcessor } from "./RoutingSpec";
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
    routeFactory: (props: any) => any;
    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routeProcessor: IRouteProcessor;
    state: IClientPartialState | IServerState;
}

export interface IContextManager {
    createContext(): IAppContext;
    render(context: IAppContext, url?: string): void;
}

export class AppContext implements IAppContext {

    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routeFactory: (props: any) => any;
    routeProcessor: IRouteProcessor;
    state: IClientPartialState | IServerState;

    constructor(
        titleComponent: ITitleComponent,
        routeFactory: (props: any) => any,
        applyCss: ApplyStyleFunction,
        routeProcessor: IRouteProcessor,
        state: IClientPartialState | IServerState) {

        this.title = titleComponent;
        this.routeFactory = routeFactory;
        this.applyCss = applyCss;
        this.routeProcessor = routeProcessor;
        this.state = state;
    }
}