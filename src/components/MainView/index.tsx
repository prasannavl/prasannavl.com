import React from "react";
import ReactDOM from "react-dom";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import createStyled from "../../modules/core/createStyled";
import { Base } from "../Base";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { DomUtils } from "../../modules/utils/DomUtils";

let style = require("./style.scss") as any;

export class MainView extends Base<any,any> {
    
    private transitionListener: any;
    static TransitionToExposeEventName = "main-view:expose";

    constructor(props: any, context: any) {
        super(props, context);
        this.transitionListener = this.transitionToExpose.bind(this);
    }

    componentWillMount() {
        super.componentWillMount();
        const preloaderId = "main-view__preloader";
        if (!__DOM__) {
            let state = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            let preloader = (
                <div id={preloaderId}>
                    <div/><div/><div/>
                </div>
            );
            state.additionalItems.push({ element: preloader, placement: "body-start" });
        } else {
            let preloaderElement = document.getElementById(preloaderId);
            DomUtils.tryRemoveElement(preloaderElement);
        }
        this.context.events.addListener(MainView.TransitionToExposeEventName, this.transitionListener);
    }

    componentWillUnmount() {
        this.context.events.removeListener(MainView.TransitionToExposeEventName, this.transitionListener);
    }

    transitionToExpose() {
        let root = ReactDOM.findDOMNode(this) as HTMLElement;
        let appElement = document.getElementById("app");
        let t = new TimelineMax();
        // Non-owned changes restored on Expose element.
        appElement.style.backgroundColor = "#0096d6";
        t.to(root, 0.2, { scale: 1.05, opacity: 0, ease: Sine.easeIn, clearProps: "transform" });
        t.addCallback(() => {
            this.navigateTo("/", false, null, "fromMainView");
        }, t.totalDuration() + 0.02);
    }

    render() {
        const view = (
            <div className={style.root}>
                <div><Sidebar /></div>
                <div><ContentView /></div>
            </div>
        );
        return view;
    }
}

export default createStyled(MainView, style);
