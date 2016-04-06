import { IServiceProviderCore } from "../core/ServiceProvider";
import { MemoryHistory } from "history-next/lib/MemoryHistory";
import { TitleServiceFactory } from "./TitleServiceFactory";
import { RendererStateFactory, IHeadlessRendererState } from "../core/RendererState";
import { JsonDecorator } from "../storage/JsonDecorator";
import { MemoryStore } from "../storage/MemoryStore";

export class ServiceProviderFactory {
    static create(): IServiceProviderCore {
        let rendererState = RendererStateFactory.create() as IHeadlessRendererState;

        let sessionStore = new JsonDecorator<any>(new MemoryStore());
        let localStore = new JsonDecorator<any>(new MemoryStore());

        return {
            rendererStateProvider: () => rendererState,
            history: new MemoryHistory(),
            title: TitleServiceFactory.create(),
            applyCss: (styleWrapper) => rendererState.cssModules.push(styleWrapper.getCssModule()),
            sessionStoreProvider: () => sessionStore,
            localStoreProvider: () => localStore,
        };
    }
}