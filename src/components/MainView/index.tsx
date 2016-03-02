import * as React from "react";

import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import LoremSegment from "../fragments/Lorem";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;

class MainView extends React.Component<any, any> {
    render() {

        const c = (
            <div className={style.root}>
                <Sidebar id="sidebar" />
                <ContentView id="content" />
                <div className="clear"></div>
            </div>
        );
        return c;
    }
}

export default createStyled(MainView, style);