import { IRouteProcessor } from "./RoutingSpec";
import { ITitleComponent } from "./TitleSpec";
import { IHistory, IHistoryContext } from "history-next";
import * as env from "fbjs/lib/ExecutionEnvironment";

export interface IServices {
    appContainer: any;
    history: IHistory;
    title: ITitleComponent;
    applyCss: ApplyStyleFunction;
    routeProcessor: IRouteProcessor;
}

let currentServices: IServices;

if (env.canUseDOM) {
    let appContainer = require("");
    const ClientService = {
        appContainer,
    }
}

export const services = currentServices;
