import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";
import { BaseWithHistoryContext } from "../Base";
import Link from "../fragments/Link";
import { IHistoryContext } from "history-next";
import { ContentManager } from "./ContentManager";

let style = require("./style.scss") as any;

class ContentView extends BaseWithHistoryContext<any, any> {
    private _contentManager: ContentManager = new ContentManager();

    componentWillMount() {
        super.componentWillMount();
        this.setup(this.context.historyContext);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    getComponent(pathname: string) {
        return this._contentManager.getContentComponent(pathname);
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