import * as React from "react";
import * as ReactDOM from "react-dom/server";
import { RouterContext } from "react-router";
import { HtmlRenderer } from "./HtmlRenderer";

export class RouteHandlerDescriptor {
    errorHandler(ctx, err) {
        const serverState = ctx.state;
        serverState.statusCode = 500;
        serverState.error = err;
    }
    renderHandler(ctx, state) {
        const createElement = (comp, props) => { props.context = ctx; return React.createElement(comp, props); }
        state["createElement"] = createElement;

        const serverState = ctx.state;
        const htmlConfig = serverState.htmlConfig;
        const titleTemplate = htmlConfig.titleTemplate;
        const title = htmlConfig.title;
        
        if (titleTemplate !== null && titleTemplate !== undefined) ctx.title.setTemplate(titleTemplate);
        if (title !== null && title !== undefined) ctx.title.set(title);

        const content = ReactDOM.renderToString(React.createElement(RouterContext, state));
        const html = HtmlRenderer.renderContent(
            Object.assign(htmlConfig, { titleTemplate: null, title: ctx.title.get() }),
            content, serverState.cssModules);

        serverState.statusCode = 200;
        serverState.data = html;
    }
    redirectHandler(ctx, nextLocation) {
        const serverState = ctx.state;
        serverState.statusCode = 302;
        serverState.data = nextLocation.pathname + nextLocation.search;
    }
    notFoundHandle(ctx) {
        const serverState = ctx.state;
        serverState.statusCode = 404;
        serverState.data = "Not found";
    }
}