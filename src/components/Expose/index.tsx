import React from "react";
import { StatelessBase } from "../Base";
import createStyled from "../../modules/core/createStyled";
import Tagline from "../fragments/Tagline";
import { IAppContext } from "../../modules/core/AppContext";
import { IHeadlessRendererState } from "../../modules/core/RendererState";
import { DomUtils } from "../../modules/utils/DomUtils";

const style = require("./style.scss") as any;

class Expose extends StatelessBase<any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    componentWillMount() {
        super.componentWillMount();
        const preloaderId = "expose-preloader";
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
            let outletElement = document.getElementById("outlet");
            outletElement.style.backgroundColor = "transparent";
        }
    }

    navigateToOverview(ev: React.MouseEvent) {
        if (DomUtils.shouldDispatchDefaultClickEvent(ev)) return;        
        ev.preventDefault();
        let content = this.refs["content"] as HTMLElement;
        let root = this.refs["expose"] as HTMLElement;
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
            <div className={style.root} ref="expose">
                <div ref="content" className="content">
                <header>
                    <h1>Prasanna V. Loganathar</h1>
                    <Tagline />
                </header>
                    <section>
                        <address className="icons">
                            <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                            <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                            <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                            <a href="mailto:Prasanna V. Loganathar <pvl@prasannavl.com>" className="icon-envelope"></a>
                        </address>
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