import React from "react";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import createStyled from "../../modules/core/createStyled";
import { StatelessBase } from "../Base";
import { IHeadlessRendererState } from "../../modules/core/RendererState";

let style = require("./style.scss") as any;

class MainView extends StatelessBase<any> {

    componentWillMount() {
        const preloaderClassName = "preloader";
        if (!__DOM__) {
            let state = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            state.htmlConfig.bodyClassNames.push(preloaderClassName);
        } else {
            document.body.classList.remove(preloaderClassName);
        }
    }

    render() {
        const view = (
            <div className={style.root}>
                <Sidebar />
                <ContentView />
                <div className="clear"></div>
            </div>
        );
        return view;
    }
}

export default createStyled(MainView, style);