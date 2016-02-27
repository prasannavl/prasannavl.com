import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;

class MainView extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <div style={style.root}>
                <Sidebar />
                <div>Hello there!</div>
            </div>
        );
        return c;        
    }
}

export default createStyled(MainView, style);