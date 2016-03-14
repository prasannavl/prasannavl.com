import * as React from "react";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;

class MainView extends React.Component<any, any> {

    renderNormalView() {
         const view = (
            <div className={style.root}>
                <Sidebar />
                <ContentView />
                <div className="clear"></div>
            </div>
        );
        return view;
    }

    componentWillMount() {
        console.log("Mount-MainView");
    }

    componentWillUnmount() {
        console.log("Unmount-MainView");
    }

    render() {
        return this.renderNormalView();
    }
}

export default createStyled(MainView, style);