require("babel-polyfill");
import { App } from "./modules/core/App";

let app = new App();
app.start();

(window as any)["app"] = app;