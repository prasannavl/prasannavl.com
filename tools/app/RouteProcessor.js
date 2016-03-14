import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { HtmlRenderer } from "./HtmlRenderer";
import { HistoryContext } from "history-next/lib/HistoryContext";
import { getPathName } from "history-next/lib/utils";
import { setupTitleForContext } from "../../src/modules/core/utils";

export class RouteProcessor {
    process(ctx, url) {
        const serverState = ctx.state;
        const htmlConfig = serverState.htmlConfig;

        setupTitleForContext(htmlConfig, ctx);
        const historyContext = HistoryContext.createFromPath(getPathName(url));
        ctx.history.setContext(historyContext);

        const element = React.createElement(ctx.appContainer, { path: url, context: ctx });
        console.log("rendering: " + url);
        const content = ReactDOM.renderToString(element);

        const html = HtmlRenderer.renderContent(
            Object.assign(htmlConfig, { titleTemplate: null, title: ctx.title.get() }),
            content, serverState.cssModules);

        serverState.statusCode = 200;
        serverState.data = html;
    }
}