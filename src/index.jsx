import React from 'react';
import { hydrate, render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { getState } from "loadable-components";
import Routes from "./Routes";
import context from "./modules/context";
import { serializeDataToWindow } from "./modules/prerender-helper";

const { envHelper, preRenderer } = context;

const run = function () {
  let Component;

  if (envHelper.devMode) {
    Component = () => <AppContainer><Routes /></AppContainer>;
  } else {
    Component = Routes;
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
  module.hot.accept('./Routes', run);
}
