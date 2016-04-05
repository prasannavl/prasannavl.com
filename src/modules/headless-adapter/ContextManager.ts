import React from "react";
import ReactDOM from "react-dom/server";
import { HistoryContext, MemoryHistory } from "history-next";
import { getPathName } from "history-next/lib/utils";
import { IContextManager } from "../core/ContextManager";
import { IAppContext, AppContextFactory } from "../core/AppContext";
import { IHeadlessRendererState } from "../core/RendererState";
import { configureTitle } from "../core/TitleService";
import { ContentResolver } from "../content-manager/ContentResolver";

export class ContextManager implements IContextManager {
    createContext() {
        return AppContextFactory.create();
    }

    configureContext(context: IAppContext, htmlConfig: any & DataModules.ITitleServiceData) {
        configureTitle(context.services.title, htmlConfig);
        const rendererState = context.services.rendererStateProvider() as IHeadlessRendererState;
        rendererState.htmlConfig = htmlConfig;
        if (typeof htmlConfig.canonical === "boolean") {
            htmlConfig.canonical = "";
        }
    }

    render(context: IAppContext, url: string) {
        const rendererState = context.services.rendererStateProvider() as IHeadlessRendererState;
        const htmlConfig = rendererState.htmlConfig;

        if (htmlConfig.canonical != null)
            htmlConfig.canonical += url;

        let titleService = context.services.title;
        configureTitle(titleService, htmlConfig as DataModules.ITitleServiceData);

        const historyContext = HistoryContext.createNormalizedFromPath(getPathName(url));
        const history = context.services.history as MemoryHistory;
        history.setContext(historyContext);

        const element = React.createElement(context.services.appContainerProvider(), { path: url, context });
        const content = ReactDOM.renderToString(element);

        let data = rendererState.data;

        if (data != null) {
            let dataScript = `window.${ContentResolver.InlineDataCacheKey} = ${JSON.stringify(rendererState.data)};`;
            let inlineScripts = htmlConfig.inlineScripts;
            inlineScripts = inlineScripts || [];
            inlineScripts.push({ content: dataScript });
            htmlConfig.inlineScripts = inlineScripts;
        }

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