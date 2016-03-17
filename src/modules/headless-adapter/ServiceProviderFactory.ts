import { IServiceProviderCore } from "../core/ServiceProvider";
import { MemoryHistory } from "history-next/lib/MemoryHistory";
import { TitleServiceFactory } from "./TitleServiceFactory";
import { RendererStateFactory, IHeadlessRendererState } from "../core/RendererState";

export class ServiceProviderFactory {
    static create(): IServiceProviderCore {
        let rendererState = RendererStateFactory.create() as IHeadlessRendererState;
        return {
            rendererStateProvider: () => rendererState,
            history: new MemoryHistory(),
            title: TitleServiceFactory.create(),
            applyCss: (styleWrapper) => rendererState.cssModules.push(styleWrapper.getCssModule()),
        };
    }
}