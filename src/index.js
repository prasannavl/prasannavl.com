import React from "react";  
import ReactDOM from "react-dom";
import { Router, match } from "react-router";
import routes from "./routes";
import history from "./modules/core/history";
import style from "./style.scss"; // eslint-disable-line no-unused-vars
import executionEnvironment from "fbjs/lib/ExecutionEnvironment";

if (__DEV__ && executionEnvironment.canUseDOM)
{
    require("normalize.css")._insertCss();
}

function init() {
    let contentLoadedEvent = "DOMContentLoaded";
    let outletElementId = "outlet";

    let handler = () => {
        document.removeEventListener(contentLoadedEvent, handler);
        let outlet = document.getElementById(outletElementId);
        
        match({ history, routes }, (error, redirectLocation, renderProps) => {
            ReactDOM.render(<Router {...renderProps} />, outlet)
        });
    };
    document.addEventListener(contentLoadedEvent, handler);
}

if (executionEnvironment.canUseDOM) {
    style._insertCss();
    init();
}

export default routes;
