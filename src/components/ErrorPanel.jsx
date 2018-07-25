import React, { Fragment } from "react";
import { getErrorInfo, getErrorStack } from "../modules/util/lang";

const ErrorPanel = (props) => {
    let { obj, info, devMode } = props;
    return <div className="vc-container app-error">
      <div>
        <h1>Something went wrong.</h1>
        {devMode ?
          <div>
            {getErrorInfo(obj)}<br />
            <br />
            {getErrorStack(obj).map((x, i) => <Fragment key={i}>{x}<br /></Fragment>)}
            <br />
            {getErrorStack(info).map((x, i) => <Fragment key={i}>{x}<br /></Fragment>)}
          </div>
          : <p>Try restarting the app to see if it helps.</p>
        }
      </div>
    </div>;
}
  
export default ErrorPanel;