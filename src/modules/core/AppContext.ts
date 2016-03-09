import { IRouteProcessor } from "./RoutingSpec";
import { ITitleComponent } from "./TitleSpec";
import { IHistory } from "../history/index";

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
    history: IHistory;
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
    history: IHistory;
    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routeProcessor: IRouteProcessor;
    state: IClientPartialState | IServerState;

    constructor(
        titleComponent: ITitleComponent,
        history: IHistory,
        applyCss: ApplyStyleFunction,
        routeProcessor: IRouteProcessor,
        state: IClientPartialState | IServerState) {

        this.title = titleComponent;
        this.history = history;
        this.applyCss = applyCss;
        this.routeProcessor = routeProcessor;
        this.state = state;
    }
}