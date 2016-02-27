import * as React from "react";
import Address from "../Address/index";
import Header from "../Header/index";

class Sidebar extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <div>
                <Header />
                <Address />
            </div>
        );
        return c;        
    }
}

export default Sidebar;