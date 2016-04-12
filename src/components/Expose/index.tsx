import React from "react";
import { StatelessBase } from "../Base";
import createStyled from "../../modules/core/createStyled";
import Tagline from "../fragments/Tagline";
import { IAppContext } from "../../modules/core/AppContext";
import { IHeadlessRendererState } from "../../modules/core/RendererState";

const style = require("./style.scss") as any;

class Expose extends StatelessBase<any> {

    constructor(props: any, context: any) {
        super(props, context);
    }

    componentWillMount() {
        super.componentWillMount();
        const preloaderClassName = "preloader";
        if (!__DOM__) {
            let state = this.getServices().rendererStateProvider() as IHeadlessRendererState;
            state.htmlConfig.bodyClassNames.push(preloaderClassName);
        } else {
            document.body.classList.remove(preloaderClassName);
        }
        this.getServices().title.reset();
        this.animateToOverview = this.animateToOverview.bind(this);
    }

    componentDidMount() {
        if (this.context.historyContext.state === "fromMainView") {
            document.body.style.background = "transparent";
        }
    }

    animateToOverview(ev: React.SyntheticEvent) {
        ev.preventDefault();
        let content = document.getElementById("content");
        let root = this.refs["expose"] as HTMLElement;
        content.style.animation = "none";
        let t = new TimelineMax();
        t.to(content, 0.5, { scale: 0.8, ease: Sine.easeOut });
        //t.to(content, 0.4, { scale: 1.7, ease: Sine.easeOut });
        t.to(content, 0.6, { opacity: 0.01, ease: Sine.easeOut }, 0);
        t.to(root, 0.37, { backgroundColor: "#fff", ease: Sine.easeIn }, 0.2);
        t.addCallback(() => {
            this.navigateTo("/overview", false, null, "fromExpose");
        }, t.totalDuration());
    }

    render() {
        return (
            <div className={style.root} ref="expose">
                <div id="content">
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
                            And I write stuff <b><a href="/overview" onClick={this.animateToOverview}>here</a></b>.
                        </div>
                        <a href="/overview" id="arrow" className="icon-arrow_forward" onClick={this.animateToOverview}></a>
                    </section>
                </div>
            </div>
        );
    }
}

export default createStyled(Expose, style);