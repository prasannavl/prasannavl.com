import * as React from "react";
import Address from "../Address/index";
import Header from "../Header/index";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;


class Sidebar extends React.Component<any, any> {

    render() {
        const c = (
            <div className={style.root} {...this.props}>
                <Header />
                <Address />
            </div>
        );
        return c;        
    }
}

export default createStyled(Sidebar, style);