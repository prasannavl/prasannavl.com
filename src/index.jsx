import App from "./App";
import { rendererFactory } from "./modules/util/render";
import preRenderer from "./modules/shared/prerender";
import env from "./modules/shared/env";

let createRenderer;

env.onLoaded(ev => {
  createRenderer = (App) => rendererFactory(() => <App />, document.getElementById("root"), preRenderer);
  createRenderer(App)();
});

if (module.hot) {
  module.hot.accept("./App", () => {
    let App = require("./App").default;
    if (createRenderer)
      createRenderer(App)();
  });
}