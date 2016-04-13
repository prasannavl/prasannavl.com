import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { StatelessBaseWithHistory } from "../Base";
import { IHistoryContext } from "history-next";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import LoadingView from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager, IDomContentManager } from "../../modules/content-manager/ContentManager";
import { ScrollView } from "../fragments/ScrollView";

export class ContentView extends StatelessBaseWithHistory<any> {
    private _contentManager: IDomContentManager | IHeadlessContentManager;
    private _pendingRequest: any = null;
    private _pendingAnimationTimeline: TimelineMax;
    private _preventAnimationOnFirstRender = false;
    private _requestStartedViewUpdateTimer: any = null;
    
    containerId = "content-container";
    scrollViewElementId = "content-scroll-view";
    contentElementId = "content-view";

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
        this.clearPendingTimeline();
        let cm = this._contentManager as IDomContentManager;
        if (cm.hasInlineDataCache()) {
            this._preventAnimationOnFirstRender = true;
        }
        this.clearRequestStartedViewUpdateTimer();
        cm.queuePath(context.pathname);
    }

    onContentReady(component: any) {
        if (this._pendingRequest !== null) {
            this._pendingRequest = null;
        }
        this.clearRequestStartedViewUpdateTimer();        
        let cm = this._contentManager as IDomContentManager;
        if (this._preventAnimationOnFirstRender) {
            this.setState({ component });
        } else {
            this.animateViewOut(this.getScrollViewElementIfAvailable(), this.getContentElementIfAvailable())
                .then(() => {
                    this.setState({ component });
                });
        }
    }

    animateViewOut(scrollViewElement: HTMLElement, contentElement: HTMLElement) {
        return new Promise((res, reject) => {
            this.clearPendingTimeline();
            if (!scrollViewElement || !contentElement) {
                res(); return;
            }
            let t = new TimelineMax();
            let scrollDuration = 0;
            let scrollTop = contentElement.scrollTop;
            let overFlowType = contentElement.style.overflow;
            if (scrollTop > 0) {
                contentElement.style.overflow = "visible";
                contentElement.style.transform = `translate3d(0, ${-scrollTop}px, 0)`
                contentElement.scrollTop = 0;
                scrollDuration = 0.3;
                let y = scrollTop > 200 ? -scrollTop + 200 : 0;
                t.to(contentElement, scrollDuration, { y, clearProps: "transform" }, 0)
            }
            t.to(scrollViewElement, scrollDuration || 0.3, { opacity: 0.01 }, 0);
            t.addCallback(() => {
                let style = contentElement.style;
                style.overflow = overFlowType;
                style.transform = "none";
                contentElement.scrollTop = 0;                
                res();
            }, t.totalDuration());

            this._pendingAnimationTimeline = t;
        });
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

    animateViewIn(scrollViewElement: HTMLElement, contentElement: HTMLElement) {
        this.clearPendingTimeline();
        let t = new TimelineMax();
        if (scrollViewElement) {
            t.to(scrollViewElement, 0.4, { opacity: 1 });
            t.from(scrollViewElement, 0.5, { x: -30, clearProps: "transform" }, 0);
        }
        if (contentElement) {
            let h1Tags = contentElement.getElementsByTagName("h1");
            let h2Tags = contentElement.getElementsByTagName("h2");
            if (h1Tags)
                t.staggerFrom(h1Tags, 0.2, { x: 100, opacity: 0.01, clearProps: "transform" }, 0.2, 0);
            if (h2Tags)
                t.staggerFrom(h2Tags, 0.2, { x: 100, opacity: 0.01, clearProps: "transform" }, 0.2, 0);
        }
        if (t.totalDuration() !== 0)
            t.addCallback(() => {
                // Workaround for gsap animations activating scrollbars.
                window.dispatchEvent(new Event("resize"));
            }, t.totalDuration());
        this._pendingAnimationTimeline = t;
    }

    componentDidUpdate() {
        if (this._pendingRequest) return;
        if (this._preventAnimationOnFirstRender) {
            this._preventAnimationOnFirstRender = false;
        }
        else {
            this.animateViewIn(this.getScrollViewElementIfAvailable(), this.getContentElementIfAvailable());
        }
        this.setFocusContentView();
    }

    getContentElementIfAvailable() {
        let el = document.getElementById(this.contentElementId);
        return el;
    }

    getScrollViewElementIfAvailable() {
        let el = document.getElementById(this.scrollViewElementId);
        return el;
    }

    onRequestStarted(req: any) {
        this._pendingRequest = req;
        this._requestStartedViewUpdateTimer = setTimeout(() => {
            if (this._pendingRequest !== null)
                this.forceUpdate();
        }, 100);
    }

    clearRequestStartedViewUpdateTimer() {
        if (this._requestStartedViewUpdateTimer != null) {
            clearTimeout(this._requestStartedViewUpdateTimer);
        }
    }

    wrapInScrollView(component: JSX.Element | JSX.Element[]) {
        return (
            <ScrollView dynamicSize={true} id={this.scrollViewElementId} className={style.root}
                viewProps={{ tabIndex: 0, id: this.contentElementId }}>
                {component}
            </ScrollView>);
    }

    setFocusContentView(view?: HTMLElement) {
        view = view || document.getElementById(this.contentElementId);
        if (view == null) return;
        view.focus();
    }
    
    render() {
        if (__DOM__) {
            let shouldRenderLoader = this._pendingRequest !== null;
            let component = this.state.component;
            
            let renderComponent = () => {
                if (component) {
                    return this.wrapInScrollView(component);
                }
                if (!shouldRenderLoader) {
                    return React.createElement(LoadingView);  
                }
                return null;
            }

            return (<div id={this.containerId}>
                { shouldRenderLoader ? <LoadingView /> : null}
                { renderComponent() }
            </div>);
        } else {
            return this.wrapInScrollView(this.getComponentForServerEnvironment());
        }
    }
}


let style = require("./style.scss") as any;
export default createStyled(ContentView, style);