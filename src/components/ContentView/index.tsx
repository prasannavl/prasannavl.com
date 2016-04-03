import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { BaseWithHistoryContext } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import { default as LoadingView, LoadingViewFactory } from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager } from "../../modules/content-manager/HeadlessContentManager";

export class ContentView extends BaseWithHistoryContext<any, any> {

    private _contentManager = ContentManagerFactory.create();
    private _pendingRequest: any = null;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
        this.onContentChange = this.onContentChange.bind(this);
        this.onRequestStarted = this.onRequestStarted.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            this._contentManager.addListener(this._contentManager.contentEventName, this.onContentChange);
            this._contentManager.addListener(this._contentManager.requestStartEventName, this.onRequestStarted);
            this.onHistoryChange(this.context.historyContext);
        }
    }

    componentWillUnmount() {
        if (__DOM__) {
            this._contentManager.removeListener(this._contentManager.contentEventName, this.onContentChange);
            this._contentManager.removeListener(this._contentManager.requestStartEventName, this.onRequestStarted);
        }
        super.componentWillUnmount();
    }

    getInitialComponent() {
        if (__DOM__) {
            return React.createElement(LoadingView);
        } else {
            let p = this.context.historyContext.pathname;
            let rendererState = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            let cm = this._contentManager as IHeadlessContentManager;
            let resolution = cm.resolve(p);
            rendererState.data = cm.getContentForResolution(resolution);
            return cm.getComponentForResolution(resolution);
        }
    }

    onHistoryChange(context: IHistoryContext) {
        let req = this._pendingRequest;
        if (req !== null) {
            req.abort();
            this._pendingRequest = null;
        }
        this._contentManager.setPath(context.pathname);
    }

    onContentChange(component: any) {
        if (this._pendingRequest != null) {
            this._pendingRequest = null;
        }
        this.setState({ component });
        let contentView = document.getElementById("content-view");
        if (__DOM__ && contentView != null) {
            TweenMax.to(contentView, 0.7,
                { scrollTop: 0, ease: Power4.easeOut });
            contentView.focus();
        }
    }

    onRequestStarted(req: any) {
        this._pendingRequest = req;
        setTimeout(() => {
            if (this._pendingRequest !== null)
                this.forceUpdate();
        }, 100);
    }

    render() {
        return <div className={style.root} tabIndex={0} id="content-view">
            { this._pendingRequest !== null ? <LoadingView /> : null}
            {
                this.state.component ||
                this.getInitialComponent()
            }
        </div>;
    }
}

let style = require("./style.scss") as any;
export default createStyled(ContentView, style);