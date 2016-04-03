import React from "react";
import ReactDOM from "react-dom";
import { createStyled, createStyledWith } from "../../modules/core/createStyled";
import { ContextualComponent } from "../AppContainer";

let style = require("./style.scss") as any;
let infinitySvg = require("!raw!./infinity.svg") as any;

export class LoadingView extends React.Component<any, any> {
    render() {
        return (
            <div tabIndex="-1" className={style.root}>
               <div dangerouslySetInnerHTML={{ __html: infinitySvg}} />
               <div className="opacifier"/>
            </div>);
    }
}

export class LoadingViewFactory {
    static createWith(styleApplier: CssStyle.StyleApplierFunction) {
        return createStyledWith(styleApplier, LoadingView, style);
    }
}

export default createStyled(LoadingView, style);