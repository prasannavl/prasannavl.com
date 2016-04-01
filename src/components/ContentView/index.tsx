import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { BaseWithHistoryContext } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import LoadingView from "../fragments/LoadingView";
import { IHeadlessRendererState } from "../../modules/core/RendererState";

export class ContentView extends BaseWithHistoryContext<any, any> {

    private _contentManager = ContentManagerFactory.create();
    private _contentChangeListener = this.onContentChange.bind(this);

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
    }

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            this._contentManager.addListener(this._contentManager.contentEventName, this._contentChangeListener);
            this.onHistoryChange(this.context.historyContext);
        }
    }

    componentWillUnmount() {
        if (__DOM__) {
            this._contentManager.removeListener(this._contentManager.contentEventName, this._contentChangeListener);
        }
        super.componentWillUnmount();
    }

    getInitialComponent() {
        if (__DOM__) {
            return React.createElement(LoadingView);
        } else {
            let p = this.context.historyContext.pathname;
            let rendererState = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            rendererState.data = this._contentManager.getContent(p);
            return this._contentManager.getComponent(p);
        }
    }

    onHistoryChange(context: IHistoryContext) {
        this._contentManager.setPath(context.pathname);
    }

    onContentChange(component: any) {
        this.setState({ component });
        let contentView = document.getElementById("content-view");
        if (contentView != null) {
            TweenMax.to(contentView, 0.7,
                { scrollTop: 0, ease: Power4.easeOut });
            contentView.focus();
        }
    }

    render() {
        return <div className={style.root} tabIndex={0} id="content-view">
            {this.state.component || this.getInitialComponent() }
        </div>;
    }
}

let style = require("./style.scss") as any;
export default createStyled(ContentView, style);