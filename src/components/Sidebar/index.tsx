import * as React from "react";
import Address from "../Address/index";
import Header from "../Header/index";

let style = require("./style.scss") as any;

class Sidebar extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <div className={style.root}>
                <Header />
                <Address />
            </div>
        );
        return c;        
    }
}

export default Sidebar;