import { TitleComponentFactory } from "./TitleComponent";
import { RouteProcessor } from "./RouteProcessor";
import { MemoryHistory } from "history-next/lib/MemoryHistory";

export class ContextManager {
    createContext() {
        let state = { data: null, error: null, statusCode: 0, cssModules: [], htmlConfig: null };
        return {
            title: TitleComponentFactory.create(),
            history: new MemoryHistory(),
            applyCss: (styleWrapper) => state.cssModules.push(styleWrapper.getCssModule()),
            routeProcessor: new RouteProcessor(),
            state
        };
    }

    render(context, url) {
        context.routeProcessor.process(context, url);
    }
}