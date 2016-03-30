import * as React from "react";
import createStyled from "../../modules/core/createStyled";
import { BaseWithHistoryContext } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "./ContentManagerFactory";
import { LoadingView } from "./LoadingView";

let style = require("./style.scss") as any;

export class ContentView extends BaseWithHistoryContext<any, any> {
    static StateDataKey = "contentViewData";

    private _contentManager = ContentManagerFactory.create();
    private _contentListener = (component: any) => {
            this.setState({ component });
        };

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            this.setup(this.context.historyContext);
        }
        this.setState({ component: this.getInitialComponent() });
    }

    componentDidMount() {
        this._contentManager.addListener(this._contentManager.contentEventName, this._contentListener);
    }

    componentWillUnmount() {
        if (__DOM__) {
            this._contentManager.removeListener(this._contentManager.contentEventName, this._contentListener);
        }
        super.componentWillUnmount();
    }

    getInitialComponent() {
        if (__DOM__) {
            return React.createElement(LoadingView);
        } else {
            let p = this.context.historyContext.pathname;
            this.context.state[ContentView.StateDataKey] = this._contentManager.getContent(p);
            return this._contentManager.getComponent(p);
        }
    }

    setup(context: IHistoryContext) {
        this._contentManager.setPath(context.pathname);
    }

    onHistoryChange(context: IHistoryContext) {
        this.setup(context);
    }

    render() {
        return <div className={style.root}>{this.state.component}</div>;
    }
}

export default createStyled(ContentView, style);