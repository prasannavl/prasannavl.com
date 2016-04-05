if (!__DOM__) {
    // Make sure babel-polyfill isn't loaded twice 
    // in a node environment
    if (!(global as any)._babelPolyfill)
        require("babel-polyfill");
} else {
    require("babel-polyfill");
}

import { App } from "./modules/core/App";

let app = new App();
app.start();

if (__DOM__) {
    (window as any)["app"] = app;
} else {
    const webpackAppKey = "_webpack_app";
    (global as any)[webpackAppKey] = app;
}