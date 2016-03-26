import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";
import { BaseWithHistoryContext } from "../Base";
import Link from "../fragments/Link";
import { IHistoryContext } from "history-next";
import { ContentManager } from "./ContentManager";
import * as Promise from "bluebird";
import { LoadingView } from "./LoadingView";

let style = require("./style.scss") as any;

class ContentView extends BaseWithHistoryContext<any, any> {

    private _contentManager: ContentManager = new ContentManager();

    componentWillMount() {
        super.componentWillMount();
        this.setup(this.context.historyContext);
        this.setState({ component: React.createElement(LoadingView) });
        this._contentManager.contentStream
            .subscribe(component => {
                this.setState({ component });
            });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    setup(context: IHistoryContext) {
        this._contentManager.resolvePath(context.pathname);
    }

    onHistoryChange(context: IHistoryContext) {
        this.setup(context);
    }

    render() {
        return <div className={style.root}>{this.state.component}</div>;
    }
}

export default createStyled(ContentView, style);