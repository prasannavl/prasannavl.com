import React from 'react';
import { hydrate, render } from 'react-dom';
import env from '../shared/env';

export const rendererFactory = function (renderFn, element, preRenderer) {
  let getCompElement;
  
  if (process.env.NODE_ENV !== "production") {
    let AppContainer = require("react-hot-loader").AppContainer;
    getCompElement = () => React.createElement(AppContainer, null, renderFn());
  } else {
    getCompElement = renderFn;
  }
  
  getCompElement = renderFn;
  
  if (env.snapMode) {
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
