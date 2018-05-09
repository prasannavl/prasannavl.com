import React from 'react';
import { hydrate, render } from 'react-dom';
import { serializeDataToWindow } from "./prerender-helper";

export const renderFactory = function (renderFn, element, context) {
  const { envHelper, preRenderer } = context;
  let getCompElement;
  
  if (process.env.NODE_ENV !== "production") {
    let AppContainer = require("react-hot-loader").AppContainer;
    getCompElement = () => <AppContainer>{renderFn()}</AppContainer>;
  } else {
    getCompElement = renderFn;
  }
  
  getCompElement = renderFn;
  
  if (envHelper.snapMode) {
    return () => {
      preRenderer.startDataSink();
      render(getCompElement(), element);
      window.snapSaveState = () => {
        preRenderer.endDataSink();
        return preRenderer.snapData();
      }
    }
  } else {
    return () => {
      preRenderer.startDataSource();
      hydrate(getCompElement(), element, () => {
        preRenderer.endDataSource();
      });
    }
  }
}
