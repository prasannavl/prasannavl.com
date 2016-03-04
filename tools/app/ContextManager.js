import { TitleComponentFactory } from "./TitleComponent";
import { RouteProcessor } from "./RouteProcessor";

export class ContextManager {
    createContext() {
        let state = { data: null, error: null, statusCode: 0, cssModules: [], htmlConfig: null };
        return {
            title: TitleComponentFactory.create(),
            routeFactory: null,
            applyCss: (styleWrapper) => state.cssModules.push(styleWrapper.getCssModule()),
            routeProcessor: new RouteProcessor(),
            state
        };
    }

    render(context, url) {
        context.routeProcessor.process(context, url);
    }
}