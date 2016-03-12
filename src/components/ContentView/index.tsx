import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";
import { BaseWithHistoryContext, IHistoryContext } from "../Base";
import Link from "../fragments/Link";

let style = require("./style.scss") as any;

class LoremContent extends React.Component<any, any> {
     render() {
        const c = <LoremSegment count={3} />;
        return c;
    }
}

class ContentView extends BaseWithHistoryContext<any, any> {

    componentWillMount() {
        super.componentWillMount();
        this.setup(this.context.historyContext);
    }

    getComponent(pathname: string) {
        if (pathname === "/overview") return <LoremContent/>;
        const contentRegex = /\/(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) return <div>{match[1]} - {match[2]}</div>;
        else return <div>Oops.Nothing here.</div>;
    }

    setup(context: IHistoryContext) {
         this.setState({
            component: this.getComponent(context.pathname)
        });
    }

    onHistoryChange(context: IHistoryContext) {
        this.setup(context);
    }

    render() {
        return <div className={style.root}>{this.state.component}</div>;
    }
}

export default createStyled(ContentView, style);