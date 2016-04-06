import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { StatelessBaseWithHistory } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import { default as LoadingView, LoadingViewFactory } from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager, IDomContentManager } from "../../modules/content-manager/ContentManager";
import { pageView } from "../../modules/ext/googleAnalytics";

export class ContentView extends StatelessBaseWithHistory<any> {
    private _contentManager: IDomContentManager | IHeadlessContentManager = ContentManagerFactory.create();
    private _pendingRequest: any = null;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
        this.onContentReady = this.onContentReady.bind(this);
        this.onRequestStarted = this.onRequestStarted.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            let cm = this._contentManager as IDomContentManager;
            cm.addListener(cm.contentReadyEventName, this.onContentReady);
            cm.addListener(cm.requestStartEventName, this.onRequestStarted);
            this.onHistoryChange(this.context.historyContext);
        }
    }

    componentWillUnmount() {
        if (__DOM__) {
            let cm = this._contentManager as IDomContentManager;
            cm.removeListener(cm.contentReadyEventName, this.onContentReady);
            cm.removeListener(cm.requestStartEventName, this.onRequestStarted);
        }
        super.componentWillUnmount();
    }

    getComponentForServerEnvironment() {
        if (!__DOM__) {
            let cm = this._contentManager as IHeadlessContentManager;
            let pathname = this.context.historyContext.pathname;
            let rendererState = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            let resolution = cm.resolve(pathname);
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
        let cm = this._contentManager as IDomContentManager;
        cm.setPath(context.pathname);
    }

    onContentReady(component: any) {
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

    getWrapped(component: JSX.Element | JSX.Element[]) {
        return (<div className={style.root} tabIndex={0} id="content-view">
            {component}
        </div>);
    }

    render() {
        if (!__DOM__) {
            return this.getWrapped(this.getComponentForServerEnvironment());
        } else {
            let items = new Array<JSX.Element>();
            this._pendingRequest && items.push(<LoadingView/>);
            let current = this.state.component;
            if (current) {
                items.push(current);
            } else {
                !this._pendingRequest && items.push(<LoadingView/>);
            }
            return this.getWrapped(items);
        }
    }
}

function focusContentView() {
    // TODO: Make sure the scroll animation happens before load, on the preceding view,
    // and not here. Or, it will interfere with ContentView scroll events.
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