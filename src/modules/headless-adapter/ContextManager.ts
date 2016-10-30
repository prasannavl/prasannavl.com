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
        if (!Array.isArray(htmlConfig.bodyClassNames)) {
            htmlConfig.bodyClassNames = [];
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

        let dataScript = `window.${ContentResolver.IsPrerenderedDomKey} = ${rendererState.isPrerenderedDom};`;
        if (rendererState.data != null) {
            dataScript += `window.${ContentResolver.InlineDataCacheKey} = ${JSON.stringify(rendererState.data)};`;
        }
        if (rendererState.staticViewCode != null) {
            dataScript += `window.${ContentResolver.StaticViewCodeKey} = "${rendererState.staticViewCode}";`;
        }
        
        let inlineScripts = htmlConfig.inlineScripts;
        inlineScripts = inlineScripts || [];
        inlineScripts.push({ content: dataScript, placement: "body-end" });
        htmlConfig.inlineScripts = inlineScripts;

        let additionalItems = rendererState.additionalItems;
        
        Object.assign(htmlConfig, {
            titleTemplate: null,
            title: titleService.get(),
            content,
            additionalItems
        });

        rendererState.statusCode = 200;
    }
}

export class ContentManagerFactory {
    static create() {
        return new ContextManager();
    }
}