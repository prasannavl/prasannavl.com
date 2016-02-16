import ReactDOM from "react-dom";
import routes from "./routes";

if (__DEV__) //eslint-disable-line 
{
    require("normalize.css");
}

function init() {
    let contentLoadedEvent = "DOMContentLoaded";
    let outletElementId = "outlet";

    let handler = () => {
        document.removeEventListener(contentLoadedEvent, handler);
        let outlet = document.getElementById(outletElementId);
        ReactDOM.render(routes, outlet);
    };
    document.addEventListener(contentLoadedEvent, handler);
}

init();