import React from "react";
import ReactDOM from "react-dom";
import createStyled from "../../modules/core/createStyled";
import { Base } from "../Base";
import { IAppContext, AppContext } from "../../modules/core/AppContext";
import { IHistoryContext } from "history-next";
import { PromiseFactory } from "../../modules/StaticCache";
import { ContentManagerFactory } from "../../modules/content-manager/ContentManagerFactory";
import LoadingView from "../LoadingView/index";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { IHeadlessContentManager, IDomContentManager } from "../../modules/content-manager/ContentManager";
import { DomUtils } from "../../modules/utils/index";
import Unknown from "../../components/Experiments/Unknown/index";

interface ContentViewState {
    component: JSX.Element;
}

export class ContentView extends Base<any, ContentViewState> {
    private _contentManager: IDomContentManager | IHeadlessContentManager;
    private _pendingRequest: any = null;
    private _pendingAnimationTimeline: TimelineMax;
    private _suspendAnimations = false;
    private _requestStartedViewUpdateTimer: any = null;
    private _diposeHistoryListener: () => void = null;

    constructor(props: any, context: any) {
        super(props, context);
        this.state = { component: null };
        let services = this.getServices();
        this._contentManager = ContentManagerFactory.create(
            services.localStoreProvider(), services.sessionStoreProvider());
        this.onContentReady = this.onContentReady.bind(this);
        this.onRequestStarted = this.onRequestStarted.bind(this);
        this.onHistoryChange = this.onHistoryChange.bind(this);
        this.onRequestFailed = this.onRequestFailed.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        if (__DOM__) {
            let cm = this._contentManager as IDomContentManager;
            cm.addListener(cm.contentReadyEventName, this.onContentReady);
            cm.addListener(cm.requestStartEventName, this.onRequestStarted);
            cm.addListener(cm.requestFailedEventName, this.onRequestFailed);
            this._diposeHistoryListener = this.getServices().history.listen(context => {
                this.onHistoryChange();
                return PromiseFactory.EmptyResolved;
            });
            this.onHistoryChange();
        }
    }

    componentWillUnmount() {
        if (__DOM__) {
            let cm = this._contentManager as IDomContentManager;
            cm.removeListener(cm.contentReadyEventName, this.onContentReady);
            cm.removeListener(cm.requestStartEventName, this.onRequestStarted);
            cm.removeListener(cm.requestFailedEventName, this.onRequestFailed);            
            this._diposeHistoryListener();
        }

        this.clearPendingTimeline();
        super.componentWillUnmount();
    }

    componentDidMount() {
        this.setFocusContentView();
    }

    componentWillUpdate(nextProps: any, nextState: ContentViewState) {
        if (this.state.component !== nextState.component) {
            this.clearPendingTimeline();
        }
    }

    componentDidUpdate(prevProps: any, prevState: ContentViewState) {
        if (this.state.component !== prevState.component) {
            if (this._pendingRequest) return;
            if (this._suspendAnimations) {
                // Currently animations are suspending only if the Dom is pre-rendered.
                // So flip it back on. Can move it out later if disabling animations is 
                // to be controlled manually.
                this._suspendAnimations = false;
            }
            else {
                this.animateViewIn(this.getRootElement(), this.getContentElementIfAvailable());
            }
            this.setFocusContentView();
        }
    }

    clearPendingTimeline() {
        if (this._pendingAnimationTimeline != null) {
            this._pendingAnimationTimeline.render(this._pendingAnimationTimeline.endTime(), false, true);
            this._pendingAnimationTimeline.kill();
            this._pendingAnimationTimeline = null;
        }
    }

    getComponentForServerEnvironment() {
        if (!__DOM__) {
            let cm = this._contentManager as IHeadlessContentManager;
            let services = this.getServices();
            let pathname = services.history.current.pathname;
            let rendererState = services.rendererStateProvider() as IHeadlessRendererState;
            let resolution = cm.resolve(pathname);
            rendererState.data = cm.getContentForResolution(resolution);
            rendererState.isPrerenderedDom = true;
            return cm.getComponentForResolution(resolution);
        }
        return null;
    }

    onHistoryChange() {
        this.clearPendingTimeline();
        this.clearRequestStartedViewUpdateTimer();
        let cm = this._contentManager as IDomContentManager;
        if (cm.hasPathChanged(this.context)) {
            this.clearPendingRequests(true);
            if (cm.isDomPrerendered()) {
                this._suspendAnimations = true;
                cm.setDomPrerendered(false);
            }
            cm.queueContext(this.context);
        } else {
            this.forceUpdate();
        }
    }

    onContentReady(component: JSX.Element) {
        this.clearPendingRequests();
        this.clearRequestStartedViewUpdateTimer();
        if (this._suspendAnimations) {
            this.setState({ component });
        } else {
            this.animateViewOut(this.getRootElement())
                .then(() => {
                    this.setState({ component });
                });
        }
    }

    animateViewOut(rootElement: HTMLElement) {
        return new Promise((res, reject) => {
            this.clearPendingTimeline();
            if (!rootElement) {
                res(); return;
            }
            let t = new TimelineMax();
            // Do the scrolling manually, by breaking the overflow visibility
            // and translating the element across, with forced hardware acceleration.
            // This is significantly faster on lower mobile devices.
            let overFlowYType = rootElement.style.overflowY;
            let savedHeight = rootElement.style.height;
            let savedTransform = rootElement.style.transform;
            let scrollTop = rootElement.scrollTop;
            if (scrollTop > 0) {
                rootElement.style.overflowY = "scroll";
                rootElement.style.height = rootElement.scrollHeight.toString() + "px";
                rootElement.style.transform = `translateY(${-scrollTop}px)`;
                let y = scrollTop > 200 ? -scrollTop + 200 : 0;
                t.to(rootElement, 0.3, { y, opacity: 0 }, 0);
                t.addCallback(() => {
                    if (scrollTop > 0) {
                        let style = rootElement.style;
                        rootElement.scrollTop = 0;
                        style.transform = savedTransform;
                        style.height = savedHeight;
                        style.overflowY = overFlowYType;
                    }
                    res();
                }, t.totalDuration());
            } else {
                res();
            }
            this._pendingAnimationTimeline = t;
        });
    }

    animateViewIn(rootElement: HTMLElement, contentElement: HTMLElement) {
        this.clearPendingTimeline();
        let t = new TimelineMax();
        if (rootElement) {
            t.fromTo(rootElement, 0.4, { opacity: 0.4, immediateRender: true }, { opacity: 1, clearProps: "all" });
            //t.from(rootElement, 0.5, { x: -30, clearProps: "all" }, 0);
        }
        let rootOverflowX: string = null;
        if (contentElement) {
            const maxHeight = rootElement.clientHeight;
            let h1Tags = Array.from(contentElement.getElementsByTagName("h1")).filter(x => x.getBoundingClientRect().top < maxHeight);
            let h2Tags = Array.from(contentElement.getElementsByTagName("h2")).filter(x => x.getBoundingClientRect().top < maxHeight);

            let headingElements = h1Tags.concat(h2Tags);
            if (headingElements.length > 0) {
                // hide the horizontal scrollbar during animation-in.
                rootOverflowX = rootElement.style.overflowX;
                rootElement.style.overflowX = "hidden";
                t.staggerFrom(headingElements, 0.2, { x: 100, opacity: 0.01, clearProps: "all" }, 0.2, 0);
            }
            t.addCallback(() => {
                if (rootOverflowX !== null) {
                    rootElement.style.overflowX = rootOverflowX;
                }
            }, t.totalDuration());
        }
        this._pendingAnimationTimeline = t;
    }

    getContentElementIfAvailable() {
        let el = this.refs["content"] as HTMLElement;
        return el;
    }

    getRootElement() {
        let el = ReactDOM.findDOMNode(this) as HTMLElement;
        return el;
    }

    onRequestStarted(req: any) {
        this._pendingRequest = req;
        // Lets not update it just yet. Give the thread a chance to resolve all caches, 
        // and see if the content is available. If so, view change can be seamless by
        // averting the loading screen instead of momentarily switching views.
        this._requestStartedViewUpdateTimer = setTimeout(() => {
            if (this._pendingRequest !== null) {
                this.forceUpdate();
            }
        }, 100);
    }

    clearPendingRequests(abort: boolean = false) {
        let req = this._pendingRequest;
        if (req !== null) {
            if (abort) req.abort();
            this._pendingRequest = null;
        }
    }
    
    clearRequestStartedViewUpdateTimer() {
        if (this._requestStartedViewUpdateTimer != null) {
            clearTimeout(this._requestStartedViewUpdateTimer);
        }
    }

    onRequestFailed(req: any, err: any) {
        this.onContentReady(<Unknown error={err.status.toString()}/>);
    }

    setFocusContentView(view?: HTMLElement) {
        view = view || ReactDOM.findDOMNode(this) as HTMLElement;
        if (view == null) return;
        view.focus();
    }

    renderWrappedComponent(component: JSX.Element) {
        let shouldRenderLoader = this._pendingRequest !== null;
        return (<div className={style.root} tabIndex="0">
            { shouldRenderLoader ? <LoadingView/> : null }
            { component ? <div ref="content" className="content-container">{component}</div> : null }
        </div>);
    }

    render() {
        let component: JSX.Element;
        if (__DOM__) {
            component = this.state.component;
        } else {
            component = this.getComponentForServerEnvironment();
        }
        return this.renderWrappedComponent(component);
    }
}


let style = require("./style.scss") as any;
export default createStyled(ContentView, style);