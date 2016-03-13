import * as React from "react";
import * as ReactDOM from "react-dom";
import { IRouteProcessor } from "../core/RoutingSpec";
import { IAppContext, IClientPartialState } from "../core/AppContext";

export class RouteProcessor implements IRouteProcessor {
    process(ctx: IAppContext, url: string) {
        const clientState = ctx.state as IClientPartialState;
        const renderSurface = clientState.renderSurface as HTMLElement;

        ReactDOM.render(React.createElement(ctx.appContainer, { context: ctx }), renderSurface, (el) => {
            // Remove all the styles that were inlined during static server side render
            Array.from(document.head.getElementsByClassName("_svx")).forEach(x => x.remove());
        });
    }
}