import React from "react";
import ReactDOM from "react-dom";
import { Base } from "../Base";
import Tagline from "../fragments/Tagline";
import createStyled from "../../modules/core/createStyled";
import { default as Link, LinkProps, startsWithMatcher } from "../fragments/Link";
import CSSTransitionGroup from "react-addons-css-transition-group";
import { ContentResolver } from "../../modules/content-manager/ContentResolver";
import { MainView } from "../MainView/index";
import Address from "../fragments/Address";

let style = require("./style.scss") as any;

class NavLink extends React.Component<LinkProps, any> {
    render() {
        return <Link activeClassName="highlight" {...this.props} />;
    }
}

class Sidebar extends Base<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.showExpose = this.showExpose.bind(this);
    }

    componentDidMount() {
        if (this.getCurrentHistoryContext().state === "fromExpose") {
            let t = new TimelineMax();
            let root = ReactDOM.findDOMNode(this) as HTMLElement;
            t.fromTo(root, 0.3, { x: "-=20", opacity: 0 }, { x: 0, opacity: 1, delay: 0.2, clearProps: "all" });
        }
    }

    showExpose(ev: React.SyntheticEvent) {
        ev.preventDefault();
        this.context.events.emit(MainView.TransitionToExposeEventName);
    }

    render() {
        let path = this.getCurrentHistoryContext().pathname;
        let isContentPath = ContentResolver.isContentPath(path);
        const c = (
            <div className={style.root}>
                <header>
                    <h1>
                        <a href="/" onClick={this.showExpose}>Prasanna V.<br/>Loganathar</a>
                    </h1>
                    <Tagline className="tagline" style={{ maxWidth: "210px" }} />
                </header>
                <CSSTransitionGroup component="nav" transitionName="sideLinks" transitionEnterTimeout={150} transitionLeaveTimeout={150}>
                    { isContentPath ?
                        <li key="1"><NavLink href="/overview" className="highlight" style={{ cursor: "pointer" }}>&larr; article</NavLink></li> :
                        <li key="2"><NavLink href="/overview">overview</NavLink></li>}
                    <li><NavLink href="/archives" activeClassMatcher={startsWithMatcher}>archives</NavLink></li>
                    <li><NavLink href="/projects">projects</NavLink></li>
                    <li><NavLink href="/about">about</NavLink></li>
                </CSSTransitionGroup>
                <Address />
            </div>
        );
        return c;
    }
}

export default createStyled(Sidebar, style);