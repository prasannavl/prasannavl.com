import * as ReactDOM from "react-dom/server";
import { HtmlRenderer } from "./HtmlRenderer";

export class RouteProcessor {
    process(ctx, url) {
        const serverState = ctx.state;
        const htmlConfig = serverState.htmlConfig;
        const titleTemplate = htmlConfig.titleTemplate;
        const title = htmlConfig.title;
        
        if (titleTemplate !== null && titleTemplate !== undefined) ctx.title.setTemplate(titleTemplate);
        if (title !== null && title !== undefined) ctx.title.set(title);

        const content = ReactDOM.renderToString(ctx.routeFactory({ path: url, context: ctx }));
        const html = HtmlRenderer.renderContent(
            Object.assign(htmlConfig, { titleTemplate: null, title: ctx.title.get() }),
            content, serverState.cssModules);

        serverState.statusCode = 200;
        serverState.data = html;
    }
}