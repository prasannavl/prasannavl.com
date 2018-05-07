import React from 'react';
import { hydrate, render } from 'react-dom';
import { getState } from "loadable-components";
import App from "./App";
import context from "./modules/context";
import { serializeDataToWindow } from "./modules/prerender-helper";

const { envHelper, preRenderer } = context;

const run = function () {
  let Component;

  if (envHelper.devMode) {
    let AppContainer = require("react-hot-loader");
    Component = () => <AppContainer><App /></AppContainer>;
  } else {
    Component = App;
  }
  
  const rootElement = document.getElementById('root');
  if (envHelper.snapMode) {
    preRenderer.startDataSink();
    render(<Component />, rootElement);
    window.snapSaveState = () => {
      preRenderer.endDataSink();
      serializeDataToWindow(getState());
      return preRenderer.snapData();
    }
  } else {
    preRenderer.startDataSource();
    hydrate(<Component />, rootElement, () => {
      preRenderer.endDataSource();
    });
  }
}

envHelper.onLoaded(ev => run());

if (module.hot) {
  module.hot.accept('./App', run);
}
