import { IServiceProviderCore } from "../core/ServiceProvider";
import { BrowserHistory } from "history-next/lib/BrowserHistory";
import { HistoryContext } from "history-next/lib/HistoryContext";
import { TitleServiceFactory } from "./TitleServiceFactory";
import { RendererStateFactory, IDomRendererState } from "../core/RendererState";
import { SessionStorageStore, LocalStorageStore } from "../storage/BrowserStores";
import { JsonDecorator } from "../storage/JsonDecorator";

export class ServiceProviderFactory {
    static create(): IServiceProviderCore {
        let rendererState = RendererStateFactory.create() as IDomRendererState;

        let history = new BrowserHistory();
        history.createContext = BrowserHistory.createNormalizedContext;

        let sessionStore = new JsonDecorator<any>(new SessionStorageStore());
        let localStore = new JsonDecorator<any>(new LocalStorageStore());

        return {
            rendererStateProvider: () => rendererState,
            history,
            title: TitleServiceFactory.create(),
            applyCss: (styleWrapper) => styleWrapper.insertIntoDom(),
            sessionStoreProvider: () => sessionStore,
            localStoreProvider: () => localStore,
        };
    }
}