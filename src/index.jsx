import App from "./App";
import appContext from "./modules/app-context";

appContext.envHelper.onLoaded(ev => {
  let createRenderer = (App) => appContext.renderFactory(() => <App />, document.getElementById("root"));
  createRenderer(App)();
});

if (module.hot) {
  module.hot.accept("./App", () => {
    let App = require("./App").default;
    createRenderer(App)();
  });
}