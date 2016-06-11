import React from "react";
import ReactDOM from "react-dom";
import { Base } from "../Base";
import Tagline from "../fragments/Tagline";
import createStyled from "../../modules/core/createStyled";
import { default as Link, LinkProps, startsWithMatcher } from "../fragments/Link";
import CSSTransitionGroup from "react-addons-css-transition-group";
import { ContentResolver } from "../../modules/content-manager/ContentResolver";
import { ScrollView } from "../fragments/ScrollView";

let style = require("./style.scss") as any;

class NavLink extends React.Component<LinkProps, any> {
  render() {
      return <Link activeClassName="highlight" {...this.props} />;
  }
}

class Sidebar extends Base<any, any> {
    componentDidMount() {
        if (this.getCurrentHistoryContext().state === "fromExpose") {
            let t = new TimelineMax();
            let root = ReactDOM.findDOMNode(this) as HTMLElement;
            t.fromTo(root, 0.3, { x: "-=20", opacity: 0 }, { x: 0, opacity: 1, delay: 0.2, clearProps: "all" });
        }
    }

    showExpose(ev: React.SyntheticEvent) {
        ev.preventDefault();
        let root = document.getElementById("main-view");
        let outletElement = document.getElementById("outlet");
        let t = new TimelineMax();
        outletElement.style.backgroundColor = "#0096d6";
        t.to(root, 0.2, { scale: 1.05, opacity: 0, ease: Sine.easeIn, clearProps: "transform" });
        t.addCallback(() => {
            this.navigateTo("/", false, null, "fromMainView");
        }, t.totalDuration() + 0.02);
    }

    render() {
        let path = this.getCurrentHistoryContext().pathname;
        let isContentPath = ContentResolver.isContentPath(path);
        const c = (
            <ScrollView className={style.root} targetProps={{ className: "sidebar" }}>
                    <header>
                        <h1>
                        <a href="/" onClick={this.showExpose.bind(this)}>Prasanna V. <br/>Loganathar</a>
                        </h1>
                        <Tagline className="tagline" style={{ maxWidth: "210px" }} />
                    </header>
                    <CSSTransitionGroup component="nav" transitionName="sideLinks" transitionEnterTimeout={150} transitionLeaveTimeout={150}>
                    { isContentPath ?
                        <li key="1"><NavLink href="/overview" className="highlight" style={{ cursor: "pointer"}}>&larr; article</NavLink></li> :
                        <li key="2"><NavLink href="/overview">overview</NavLink></li>}
                        <li><NavLink href="/archives" activeClassMatcher={startsWithMatcher}>archives</NavLink></li>
                        <li><NavLink href="/about">about</NavLink></li>
                        <li><NavLink href="/feedback">feedback</NavLink></li>
                    </CSSTransitionGroup>
                    <address className="icons">
                            <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                            <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                            <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                            <a href="mailto:Prasanna V. Loganathar <pvl@prasannavl.com>" className="icon-envelope"></a>
                    </address>
            </ScrollView>
        );
        return c;
    }
}

export default createStyled(Sidebar, style);