import React from "react";  
import ReactDOM from "react-dom";
import { Router, match } from "react-router";
import routes from "./routes";
import history from "./modules/core/history";
import style from "./style.scss";
import executionEnvironment from "fbjs/lib/ExecutionEnvironment";

if (__DEV__ && executionEnvironment.canUseDOM)
{
    require("normalize.css").insertIntoDom();
}

function init() {
    const contentLoadedEvent = "DOMContentLoaded";
    const outletElementId = "outlet";

    const handler = () => {
        document.removeEventListener(contentLoadedEvent, handler);
        
        const outlet = document.getElementById(outletElementId);
        const applyCss = styles => styles.insertIntoDom();        
        const createElement = (comp, props) => { return React.createElement(comp, { ...props, applyCss }); };
        
        match({ history, routes }, (error, redirectLocation, renderProps) => {
            renderProps.createElement = createElement;
            ReactDOM.render(React.createElement(Router, renderProps), outlet);
        });
    };
    document.addEventListener(contentLoadedEvent, handler);
}

if (executionEnvironment.canUseDOM) {
    style.insertIntoDom();
    init();
}
