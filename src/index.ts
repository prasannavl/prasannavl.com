import * as React from "react";  
import * as ReactDOM from "react-dom";
import { Router, match } from "react-router";
import routes from "./routes";
import history from "./modules/core/history";
import * as executionEnvironment from "fbjs/lib/ExecutionEnvironment";

let style = require("./style.scss") as ParsedCss;

if (__DEV__)
{
    if (executionEnvironment.canUseDOM) {
        (require("normalize.css") as ParsedCss).insertIntoDom();
        style.insertIntoDom();
    }
}

if (executionEnvironment.canUseDOM)
{
    init();
}

function init() {
    const contentLoadedEvent = "DOMContentLoaded";
    const outletElementId = "outlet";

    const handler = () => {
        document.removeEventListener(contentLoadedEvent, handler);
        
        const outlet = document.getElementById(outletElementId);
        const applyCss = (styles: ParsedCss) => styles.insertIntoDom();        
        const createElement = (comp: any, props:any) => { props.applyCss = applyCss; return React.createElement(comp, props); };
        
        match({ history, routes }, (error:any, redirectLocation:any, renderProps:any) => {
            renderProps.createElement = createElement;
            ReactDOM.render(React.createElement(Router, renderProps), outlet, (el) => {
                // Remove all the styles that were inlined during static server side render
                Array.from(document.head.getElementsByClassName("_svx")).forEach(x => x.remove());
            });
        });
    };
    document.addEventListener(contentLoadedEvent, handler);
}