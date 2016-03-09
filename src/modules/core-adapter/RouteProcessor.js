import * as React from "react";
import * as ReactDOM from "react-dom";
import AppContainer from "../../components/AppContainer";

export class RouteProcessor {
    process(ctx, url) {
        const clientState = ctx.state;
        const renderSurface = clientState.renderSurface;

        ReactDOM.render(React.createElement(AppContainer, { context: ctx }), renderSurface, (el) => {
            // Remove all the styles that were inlined during static server side render
            Array.from(document.head.getElementsByClassName("_svx")).forEach(x => x.remove());
        });
    }
}