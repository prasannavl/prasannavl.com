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

    private _contentManager = new ContentManager();
    private _contentListener = (component: any) => {
            this.setState({ component });
        };

    componentWillMount() {
        super.componentWillMount();
        this.setup(this.context.historyContext);
        this.setState({ component: this.getInitialComponent() });
    }

    componentDidMount() {
        this._contentManager.addListener(ContentManager.contentEventName, this._contentListener);
    }

    componentWillUnmount() {
        this._contentManager.removeListener(ContentManager.contentEventName, this._contentListener);
        super.componentWillUnmount();
    }

    getInitialComponent() {
        if (__DOM__) {
            return React.createElement(LoadingView);
        } else {
            return this._contentManager.loadPathSync(this.context.historyContext.pathname);
        }
    }

    setup(context: IHistoryContext) {
        if (__DOM__)
            this._contentManager.loadPath(context.pathname);
    }

    onHistoryChange(context: IHistoryContext) {
        this.setup(context);
    }

    render() {
        return <div className={style.root}>{this.state.component}</div>;
    }
}

export default createStyled(ContentView, style);