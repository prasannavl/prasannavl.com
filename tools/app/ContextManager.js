import { HistoryFactory } from "./History";
import { TitleComponentFactory } from "./TitleComponent";
import { RouteHandlerDescriptor } from "./RouteHandlerDescriptor";
import { ReactRouterProcessor } from "../../src/modules/coreAdapter/ReactRouterProcessor";

export class ContextManager {
    createContext() {
        let state = { data: null, error: null, statusCode: 0, cssModules: [], htmlConfig: null };
        return {
            history: HistoryFactory.create(),
            title: TitleComponentFactory.create(),
            routes: null,
            applyCss: (styleWrapper) => state.cssModules.push(styleWrapper.getCssModule()),
            routeProcessor: new ReactRouterProcessor(),
            routeHandlerDescriptor: new RouteHandlerDescriptor(),
            state
        };
    }

    render(context, url) {
        context.routeProcessor.process(context, url);
    }
}