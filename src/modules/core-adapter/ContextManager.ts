import { TitleComponentFactory } from "./TitleComponent";
import { AppContext, IClientPartialState } from "../core/AppContext";
import { RouteProcessor } from "./RouteProcessor";
import { BrowserHistory } from "../history/index";

export class ContextManager {
    createContext() {
        return new AppContext(
            TitleComponentFactory.create(),
            new BrowserHistory(),
            (styleWrapper) => styleWrapper.insertIntoDom(),
            new RouteProcessor(),
            { renderSurface: null });
    }

    render(context: AppContext, url?: string) {
        context.routeProcessor.process(context, url);
    }
}