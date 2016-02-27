import * as React from "react";
import Sidebar from "../Sidebar/index";

class MainView extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <div>
                <Sidebar />
                <div>Hello there!</div>
            </div>
        );
        return c;        
    }
}

export default Sidebar;