import React from "react";
import ReactDOM from "react-dom/server";
import { HistoryContext, MemoryHistory } from "history-next";
import { getPathName } from "history-next/lib/utils";
import { IContextManager } from "../core/ContextManager";
import { IAppContext, AppContextFactory } from "../core/AppContext";
import { IHeadlessRendererState } from "../core/RendererState";
import { configureTitle } from "../core/TitleService";

export class ContextManager implements IContextManager {
    createContext() {
        return AppContextFactory.create();
    }

    configureContext(context: IAppContext, htmlConfig: any & DataModules.ITitleServiceData) {
        configureTitle(context.services.title, htmlConfig);
        const rendererState = context.services.rendererStateProvider() as IHeadlessRendererState;
        rendererState.htmlConfig = htmlConfig;
    }

    render(context: IAppContext, url: string) {
        const rendererState = context.services.rendererStateProvider() as IHeadlessRendererState;
        const htmlConfig = rendererState.htmlConfig;
        htmlConfig.canonical += url;

        let titleService = context.services.title;
        configureTitle(titleService, htmlConfig as DataModules.ITitleServiceData);

        const historyContext = HistoryContext.createNormalizedFromPath(getPathName(url));
        const history = context.services.history as MemoryHistory;
        history.setContext(historyContext);

        const element = React.createElement(context.services.appContainerProvider(), { path: url, context });
        console.log("rendering: " + url);
        const content = ReactDOM.renderToString(element);

        Object.assign(htmlConfig, {
            titleTemplate: null,
            title: titleService.get(),
            content,
        });

        rendererState.statusCode = 200;
    }
}

export class ContentManagerFactory {
    static create() {
        return new ContextManager();
    }
}