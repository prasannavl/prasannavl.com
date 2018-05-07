import React from 'react';
import { hydrate, render } from 'react-dom';
import { getState } from "loadable-components";
import { serializeDataToWindow } from "./prerender-helper";

export const renderFactory = function (Component, element, context) {
  const { envHelper, preRenderer } = context;
  let Wrapper;
  
  if (envHelper.devMode) {
    let AppContainer = require("react-hot-loader").AppContainer;
    Wrapper = () => <AppContainer><Component /></AppContainer>;
  } else {
    Wrapper = Component;
  }
  
  if (envHelper.snapMode) {
    return () => {
      preRenderer.startDataSink();
      render(<Wrapper />, element);
      window.snapSaveState = () => {
        preRenderer.endDataSink();
        serializeDataToWindow(getState());
        return preRenderer.snapData();
      }
    }
  } else {
    return () => {
      preRenderer.startDataSource();
      hydrate(<Wrapper />, element, () => {
        preRenderer.endDataSource();
      });
    }
  }
}
