import { IAppContext, AppContext, IClientPartialState } from "../core/AppContext";
import { IRouteHandlerDescriptor } from "../core/RoutingSpec";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Router } from "react-router";

export class RouteHandlerDescriptor implements IRouteHandlerDescriptor {
    errorHandler(ctx: IAppContext, err: any) {

    }
    renderHandler(ctx: IAppContext, state: ReactRouter.MatchState) {

        const createElement = (comp: any, props: any) => { props.context = ctx; return React.createElement(comp, props); }
        (state as any)["createElement"] = createElement;

        const clientState = ctx.state as IClientPartialState;
        const renderSurface = clientState.renderSurface;

        ReactDOM.render(React.createElement(Router as any, state), renderSurface as HTMLElement, (el) => {
            // Remove all the styles that were inlined during static server side render
            Array.from(document.head.getElementsByClassName("_svx")).forEach(x => x.remove());
        });

    }
    redirectHandler(ctx: IAppContext, nextLocation: HistoryModule.Location) {

    }
    notFoundHandle(ctx: IAppContext, location: HistoryModule.Location) {

    }
}