import { ITitleService } from "./TitleService";
import AppContainer from "../../components/AppContainer";
import { IRendererState } from "./RendererState";
import { IStorage } from "../storage/Storage";
import { IHistory } from "history-next/lib/HistoryCore";

export type IServiceProvider = IServiceProviderCommonCore & IServiceProviderCore;

export interface IServiceProviderCommonCore {
    appContainerProvider: () => any;
}

export interface IServiceProviderCore {
    rendererStateProvider: () => IRendererState;
    history: IHistory;
    title: ITitleService;
    applyCss: CssStyle.StyleApplierFunction;
    sessionStoreProvider: () => IStorage<string>;
    localStoreProvider: () => IStorage<string>;
}

export class ServiceProviderFactory {
    static create() {
        let commonCoreProvider: IServiceProviderCommonCore = {
            appContainerProvider: () => AppContainer
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