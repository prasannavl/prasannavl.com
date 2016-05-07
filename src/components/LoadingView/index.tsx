import React from "react";
import ReactDOM from "react-dom";
import { createStyled, createStyledWith } from "../../modules/core/createStyled";
import { StatelessBase } from "../Base";

let style = require("./style.scss") as any;
// let infinitySvg = require("!raw!./infinity.svg") as any;

export class LoadingView extends StatelessBase<any> {
    render() {
        return (
            <div tabIndex="-1" className={style.root}>
                <div className="container">
                    <div className="spinner">
                        <div/>
                        <div/>
                        <div/>
                    </div>
               </div>
               <div className="opacifier" />
            </div>);
    }
}

export class LoadingViewFactory {
    static createWith(styleApplier: CssStyle.StyleApplierFunction) {
        return createStyledWith(styleApplier, LoadingView, style);
    }
}

export default createStyled(LoadingView, style);