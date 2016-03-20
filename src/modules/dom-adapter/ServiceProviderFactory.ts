import { IServiceProviderCore } from "../core/ServiceProvider";
import { BrowserHistory } from "history-next/lib/BrowserHistory";
import { HistoryContext } from "history-next/lib/HistoryContext";
import { TitleServiceFactory } from "./TitleServiceFactory";
import { RendererStateFactory, IDomRendererState } from "../core/RendererState";

export class ServiceProviderFactory {
    static create(): IServiceProviderCore {
        let rendererState = RendererStateFactory.create() as IDomRendererState;

        let history = new BrowserHistory();
        history.createContext = BrowserHistory.createNormalizedContext;
        
        return {
            rendererStateProvider: () => rendererState,
            history,
            title: TitleServiceFactory.create(),
            applyCss: (styleWrapper) => styleWrapper.insertIntoDom(),
        };
    }
}