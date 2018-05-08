import App from "./App";
import appContext from "./modules/app-context";

appContext.envHelper.onLoaded(ev => {
  let render = appContext.renderFactory(App, document.getElementById("root"));
  render();
  if (module.hot) {
    module.hot.accept('./App', render);
  }
});
