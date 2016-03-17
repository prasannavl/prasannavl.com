import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";
import { BaseWithHistoryContext } from "../Base";
import Link from "../fragments/Link";
import { IHistoryContext } from "history-next";

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

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    getComponent(pathname: string) {
        const titleService = this.getServices().title;
        if (pathname === "/overview") { titleService.set("Overview"); return <LoremContent/>; };
        const contentRegex = /\/(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            titleService.set("Matchyman");
            return <div>{match[1]} - {match[2]}</div>; }
        else {
            titleService.set("Not found");
            return  <div>Oops.Nothing here.</div>; }
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