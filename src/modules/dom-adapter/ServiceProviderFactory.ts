import { IServiceProviderCore } from "../core/ServiceProvider";
import { BrowserHistory } from "history-next/lib/BrowserHistory";
import { TitleServiceFactory } from "./TitleServiceFactory";
import { RendererStateFactory, IDomRendererState } from "../core/RendererState";

export class ServiceProviderFactory {
    static create(): IServiceProviderCore {
        let rendererState = RendererStateFactory.create() as IDomRendererState;
        return {
            rendererStateProvider: () => rendererState,
            history: new BrowserHistory(),
            title: TitleServiceFactory.create(),
            applyCss: (styleWrapper) => styleWrapper.insertIntoDom(),
        };
    }
}