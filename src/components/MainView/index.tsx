import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import createStyled from "../../modules/core/createStyled";
import { Base } from "../Base";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { DomUtils } from "../../modules/utils/DomUtils";

let style = require("./style.scss") as any;

export class MainView extends Base<any,any> {

    componentWillMount() {
        super.componentWillMount();
        const preloaderId = "mainview-preloader";
        if (!__DOM__) {
            let state = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            let preloader = (
                <div id={preloaderId}>
                    <div/><div/><div/>
                </div>
            );
            state.additionalItems.push({ element: preloader, placement: "body-start" });
        } else {
            let preloaderElement = document.getElementById(preloaderId);
            DomUtils.tryRemoveElement(preloaderElement);
        }
    }

    render() {
        const view = (
            <div className={style.root} id="main-view">
                <Sidebar />
                <ContentView />
                <div className="clear"></div>
            </div>
        );
        return view;
    }
}

export default createStyled(MainView, style);
