import React from "react";
import ReactDOM from "react-dom";
import { StatelessBase } from "../Base";
import createStyled from "../../modules/core/createStyled";
import Tagline from "../fragments/Tagline";
import { IAppContext } from "../../modules/core/AppContext";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { DomUtils } from "../../modules/utils/DomUtils";
import Address from "../fragments/Address";

const style = require("./style.scss") as any;

class Expose extends StatelessBase<any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    componentWillMount() {
        super.componentWillMount();
        const preloaderId = "expose__preloader";
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
        this.getServices().title.reset();
        this.navigateToOverview = this.navigateToOverview.bind(this);
    }

    componentDidMount() {
        if (this.getCurrentHistoryContext().state === "fromMainView") {
            let appElement = document.getElementById("app");
            // Restore non-owned.
            appElement.style.backgroundColor = "transparent";
        }
    }

    navigateToOverview(ev: React.MouseEvent) {
        if (DomUtils.shouldDispatchDefaultClickEvent(ev)) return;        
        ev.preventDefault();
        let root = ReactDOM.findDOMNode(this) as HTMLElement;
        let content = root.firstChild as HTMLElement;
        content.style.animation = "none";
        let t = new TimelineMax();
        t.to(content, 0.3, { scale: 0.9, ease: Sine.easeOut });
        t.to(content, 0.4, { scale: 1.7, ease: Sine.easeOut });
        t.to(content, 0.6, { opacity: 0.01, ease: Sine.easeOut }, 0);
        t.to(root, 0.37, { backgroundColor: "#fff", ease: Sine.easeIn }, 0.2);
        t.addCallback(() => {
            this.navigateTo("/overview", false, null, "fromExpose");
        }, t.totalDuration());
    }

    render() {
        return (
            <div className={style.root}>
                <div>
                    <header>
                        <h1>Prasanna V. Loganathar</h1>
                        <Tagline />
                    </header>
                    <section>
                        <Address />
                        <div className="info">
                            And I write stuff <b><a href="/overview" onClick={this.navigateToOverview}>here</a></b>.
                        </div>
                        <a href="/overview" className="icon-arrow_forward arrow" onClick={this.navigateToOverview}></a>
                    </section>
                </div>
            </div>
        );
    }
}

export default createStyled(Expose, style);