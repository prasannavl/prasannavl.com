import * as React from "react";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;

class MainView extends React.Component<any, any> {
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