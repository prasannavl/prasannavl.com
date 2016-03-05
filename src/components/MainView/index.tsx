import * as React from "react";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import LoremSegment from "../fragments/Lorem";
import createStyled from "../../modules/core/createStyled";
import { Base } from "../Base";

let style = require("./style.scss") as any;

class MainView extends Base<any, any> {
    render() {

        const c = (
            <div className={style.root}>
                <Sidebar />
                <ContentView />
                <div className="clear"></div>
            </div>
        );
        return c;
    }
}

export default createStyled(MainView, style);