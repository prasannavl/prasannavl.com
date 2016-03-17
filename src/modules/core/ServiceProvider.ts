import { ITitleService } from "./TitleService";
import { IHistory } from "history-next/lib/HistoryCore";
import { IHistoryContext } from "history-next/lib/HistoryContext";
import AppContainer from "../../components/AppContainer";
import { IRendererState } from "./core/RendererState";

export type IServiceProvider = IServiceProviderCommonCore & IServiceProviderCore;

export interface IServiceProviderCommonCore {
    appContainerProvider: () => any;
}

export interface IServiceProviderCore {
    rendererStateProvider: () => IRendererState;
    history: IHistory;
    title: ITitleService;
    applyCss: CssStyle.StyleApplierFunction;
}

export class ServiceProviderFactory {
    static create() {
        let commonCoreProvider: IServiceProviderCommonCore = {
            appContainerProvider: () => AppContainer,
        };

        let coreProviderFactory: Core.IFactory<IServiceProviderCore>;

        if (__DOM__) {
            coreProviderFactory = require("../dom-adapter/ServiceProviderFactory").ServiceProviderFactory;
        } else {
            coreProviderFactory = require("../headless-adapter/ServiceProviderFactory").ServiceProviderFactory;
        }

        let services = Object.assign({}, commonCoreProvider, coreProviderFactory.create());
        return services;
    }
}