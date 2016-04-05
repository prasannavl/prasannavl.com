import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { StatelessBaseWithHistory } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import { default as LoadingView, LoadingViewFactory } from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager } from "../../modules/content-manager/HeadlessContentManager";
import { pageView } from "../../modules/ext/googleAnalytics";

export class ContentView extends StatelessBaseWithHistory<any> {
    private _contentManager = ContentManagerFactory.create();
    private _pendingRequest: any = null;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
        this.onContent = this.onContent.bind(this);
        this.onRequestStarted = this.onRequestStarted.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            this._contentManager.addListener(this._contentManager.contentEventName, this.onContent);
            this._contentManager.addListener(this._contentManager.requestStartEventName, this.onRequestStarted);
            this.onHistoryChange(this.context.historyContext);
        }
    }

    componentWillUnmount() {
        if (__DOM__) {
            this._contentManager.removeListener(this._contentManager.contentEventName, this.onContent);
            this._contentManager.removeListener(this._contentManager.requestStartEventName, this.onRequestStarted);
        }
        super.componentWillUnmount();
    }

    getComponentForServerEnvironment() {
        if (!__DOM__) {
            let p = this.context.historyContext.pathname;
            let rendererState = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            let cm = this._contentManager as IHeadlessContentManager;
            let resolution = cm.resolve(p);
            rendererState.data = cm.getContentForResolution(resolution);
            return cm.getComponentForResolution(resolution);
        }
        return null;
    }

    onHistoryChange(context: IHistoryContext) {
        let req = this._pendingRequest;
        if (req !== null) {
            req.abort();
            this._pendingRequest = null;
        }
        this._contentManager.setPath(context.pathname);
    }

    onContent(component: any) {
        if (this._pendingRequest != null) {
            this._pendingRequest = null;
        }
        this.setState({ component });
        focusContentView();
        recordPageView("/" + this.context.historyContext.pathname);
    }

    onRequestStarted(req: any) {
        this._pendingRequest = req;
        setTimeout(() => {
            if (this._pendingRequest !== null)
                this.forceUpdate();
        }, 100);
    }

    render() {
        if (!__DOM__) {
            return this.getComponentForServerEnvironment();
        } else {

            // If pendingRequest, display the LoadingView.
            // Simply render the component. 
            // In the component was null, check if LoadingView was already rendered, 
            // using pendingRequest. If it was, no action, or render LoadingView.

            return (<div className={style.root} tabIndex={0} id="content-view">
                { this._pendingRequest ? <LoadingView /> : null}
                { this.state.component }
                { !this.state.component && !this._pendingRequest ? <LoadingView/> : null }
            </div>);
        }
    }
}

function focusContentView() {
    if (__DOM__) {
        let contentView = document.getElementById("content-view");
        if (contentView == null) return;
        TweenMax.to(contentView, 0.7,
            { scrollTop: 0, ease: Power4.easeOut });
        contentView.focus();
    }
}

function recordPageView(path: string) {
    if (!__DEV__) {
        setTimeout(() => {
            pageView(path);
        }, 100);
    }
}

let style = require("./style.scss") as any;
export default createStyled(ContentView, style);