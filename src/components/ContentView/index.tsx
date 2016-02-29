import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremFragment from "../LoremFragment/index";

let style = require("./style.scss") as any;

class ContentView extends React.Component<any, any> {
    render() {
        const c = (
            <div className={style.root} {...this.props}>
                <LoremFragment count={20} />
            </div>
        );
        return c;
    }
}

export default createStyled(ContentView, style);