import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { StatelessBaseWithHistory } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import { default as LoadingView, LoadingViewFactory } from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager, IDomContentManager } from "../../modules/content-manager/ContentManager";
import { ScrollView } from "../fragments/ScrollView";

export class ContentView extends StatelessBaseWithHistory<any> {
    private _contentManager: IDomContentManager | IHeadlessContentManager;
    private _pendingRequest: any = null;
    private _pendingAnimationTimeline: TimelineMax;
    contentViewWrapperId = "content-view-wrapper";
    contentViewId = "content-view";

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
        let services = this.getServices();
        this._contentManager = ContentManagerFactory.create(
            services.localStoreProvider(), services.sessionStoreProvider());
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
        this.clearPendingTimeline();
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
        cm.queuePath(context.pathname);
    }

    onContentReady(component: any) {
        if (this._pendingRequest !== null) {
            this._pendingRequest = null;
        }
        if (__DOM__) {
            let contentView = document.getElementById(this.contentViewWrapperId);
            if (contentView == null) return;
            this.animateViewOut(contentView, document.getElementById(this.contentViewId))
                .then(() => {
                    this.setState({ component });
                });
        }
    }

    animateViewOut(viewElement: HTMLElement, scrollElement: HTMLElement) {
        if (__DOM__) {
            return new Promise((res, reject) => {
                this.clearPendingTimeline();
                let t = new TimelineMax();
                let scrollDuration = 0;
                if (scrollElement.scrollTop > 0) {
                    scrollDuration = 0.6;
                    t.to(scrollElement, scrollDuration, { scrollTop: 0, ease: Power4.easeOut }, 0);
                }
                t.to(viewElement, scrollDuration || 0.3, { opacity: 0.01 }, 0)
                t.addCallback(() => {
                    res();
                }, t.totalDuration());
                this._pendingAnimationTimeline = t;
            }) as Promise<any>;
        } else {
            return Promise.resolve();
        }
    }

    clearPendingTimeline() {
        if (this._pendingAnimationTimeline != null) {
            this._pendingAnimationTimeline.render(this._pendingAnimationTimeline.endTime(), true, true);
            this._pendingAnimationTimeline.kill();
            this._pendingAnimationTimeline = null;
        }
    }

    componentDidMount() {
        this.setFocusContentView();
    }

    componentWillUpdate() {
        this.clearPendingTimeline();
    }

    animateViewIn(viewElement: HTMLElement) {
        this.clearPendingTimeline();
        let h1Tags = viewElement.getElementsByTagName("h1");
        let h2Tags = viewElement.getElementsByTagName("h2");
        let t = new TimelineMax();
        t.to(viewElement, 0.4, { opacity: 1 });
        t.from(viewElement, 0.3, { x: -50, clearProps: "transform" }, 0);
        t.staggerFrom(h1Tags, 0.2, { x: 100, opacity: 0.01, clearProps: "transform" }, 0.2, 0);
        t.staggerFrom(h2Tags, 0.2, { x: 100, opacity: 0.01, clearProps: "transform" }, 0.2, 0);
        t.addCallback(() => {
            window.dispatchEvent(new Event('resize'));
        }, t.totalDuration());
        this._pendingAnimationTimeline = t;
    }

    componentDidUpdate() {
        if (__DOM__) {
            if (this._pendingRequest) return;
            let contentView = document.getElementById(this.contentViewWrapperId);
            if (contentView == null) return;
            this.animateViewIn(contentView);
            this.setFocusContentView();
        }
    }

    onRequestStarted(req: any) {
        this._pendingRequest = req;
        setTimeout(() => {
            if (this._pendingRequest !== null)
                this.forceUpdate();
        }, 100);
    }

    getWrapped(component: JSX.Element | JSX.Element[]) {
        return (
            <ScrollView dynamicSize={true} id={this.contentViewWrapperId} className={style.root}
                viewProps={{ tabIndex: 0, id: this.contentViewId }}>
                {component}
            </ScrollView>);
    }

    setFocusContentView(view?: HTMLElement) {
        view = view || document.getElementById(this.contentViewId);
        if (view == null) return;
        view.focus();
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


let style = require("./style.scss") as any;
export default createStyled(ContentView, style);