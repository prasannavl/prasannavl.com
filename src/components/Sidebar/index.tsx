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
            t.from(root, 0.3, { x: "-=10" });
        }
    }

    showExpose(ev: React.SyntheticEvent) {
        ev.preventDefault();
        let root = document.getElementById("main-view");
        let t = new TimelineMax();
        document.body.style.background = "#0096d6";
        t.to(root, 0.2, { scale: 1.05, opacity: 0.1, ease: Sine.easeIn });
        t.addCallback(() => {
            this.navigateTo("/", false, null, "fromMainView");
        }, t.totalDuration());
    }

    render() {
        let path = this.getCurrentHistoryContext().pathname;
        let isContentPath = ContentResolver.isContentPath(path);
        const c = (
            <ScrollView className={style.root} viewProps={{ className: "sidebar" }}>
                    <header>
                        <h1>
                        <a href="/" onClick={this.showExpose.bind(this)}>Prasanna V. <br/>Loganathar</a>
                        </h1>
                        <Tagline className="tagline" style={{ maxWidth: "210px" }} />
                    </header>
                    <CSSTransitionGroup component="nav" transitionName="sideLinks" transitionEnterTimeout={150} transitionLeaveTimeout={150}>
                    { isContentPath ?
                        <li key="ax"><NavLink href="/overview" className="highlight">&larr; article</NavLink></li> :
                        <li key="o"><NavLink href="/overview">overview</NavLink></li>}
                        <li key="ar"><NavLink href="/archives" activeClassMatcher={startsWithMatcher}>archives</NavLink></li>
                        <li key="ab"><NavLink href="/about">about</NavLink></li>
                        <li key="f"><NavLink href="/feedback">feedback</NavLink></li>
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