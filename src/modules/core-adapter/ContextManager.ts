import { TitleComponentFactory } from "./TitleComponent";
import { AppContext, IClientPartialState } from "../core/AppContext";
import { RouteProcessor } from "./RouteProcessor";
import routeFactory from "../../routeFactory";

export class ContextManager {
    createContext() {
        return new AppContext(
            TitleComponentFactory.create(),
            routeFactory,
            (styleWrapper) => styleWrapper.insertIntoDom(),
            new RouteProcessor(),
            { renderSurface: null });
    }

    render(context: AppContext, url?: string) {
        context.routeProcessor.process(context, url);
    }
}