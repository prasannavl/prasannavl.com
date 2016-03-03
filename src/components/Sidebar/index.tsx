import * as React from "react";
import Base from "../Base";
import Tagline from "../fragments/Tagline";
import createStyled from "../../modules/core/createStyled";
import { IndexLink, Link } from "react-router";

let style = require("./style.scss") as any;

class NavLink extends React.Component<any, any>
{
  render() {
      return <Link {...this.props} activeClassName="highlight"/>;
  }
}

function getFeedbackLink() {
    const message = encodeURIComponent("@prasannavl, #prasannavl.com ");
    return `https://twitter.com/intent/tweet?text=${message}`;
}

class Sidebar extends Base<any, any> {

    render() {
        const c = (
            <div className={style.root} {...this.props}>
                <header>
                    <h1>
                        <IndexLink to="/">Prasanna V. Loganathar</IndexLink>
                    </h1>
                     <Tagline className="tagline" />
                </header>
                <nav>
                    <li><NavLink to="/overview">overview</NavLink></li>
                    <li><NavLink to="/archives">archives</NavLink></li>
                    <li><NavLink to="/about">about</NavLink></li>
                    <li><a href={getFeedbackLink()} target="_blank">feedback</a></li>
                </nav>
                <address className="icons">
                        <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                        <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                        <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                        <a href="mailto:Prasanna V. Loganathar <pvl@prasannavl.com>" className="icon-envelope"></a>
                </address>
            </div>
        );
        return c;
    }
}

export default createStyled(Sidebar, style);