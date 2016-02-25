import { HistoryFactory } from "./History";
import { TitleComponentFactory } from "./TitleComponent";
import { RouteHandlerDescriptor } from "./RouteHandlerDescriptor";
import { AppContext, IClientPartialState } from "../core/AppContext";
import { ReactRouterProcessor } from "./ReactRouterProcessor";
import routes from "../../routes";

export class ContextManager {
    createContext() {
        return new AppContext(
            HistoryFactory.create(),
            TitleComponentFactory.create(),
            routes,
            (styleWrapper) => styleWrapper.insertIntoDom(),
            new ReactRouterProcessor(),
            new RouteHandlerDescriptor(),
            { renderSurface: null });
    }

    render(context: AppContext, url?: string) {
        context.routeProcessor.process(context, url);
    }
}