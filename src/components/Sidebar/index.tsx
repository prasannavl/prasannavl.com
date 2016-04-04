import React from "react";
import { Base } from "../Base";
import Tagline from "../fragments/Tagline";
import createStyled from "../../modules/core/createStyled";
import Link from "../fragments/Link";

let style = require("./style.scss") as any;

class NavLink extends React.Component<any, any> {
  render() {
      return <Link {...this.props} activeClassName="highlight"/>;
  }
}

class Sidebar extends Base<any, any> {
    render() {
        const c = (
            <div className={style.root} {...this.props}>
                <header>
                    <h1>
                        <NavLink href="/">Prasanna V. <br/>Loganathar</NavLink>
                    </h1>
                    <Tagline className="tagline" style={{ maxWidth: "210px" }} />
                </header>
                <nav>
                    <li><NavLink href="/overview">overview</NavLink></li>
                    <li><NavLink href="/archives">archives</NavLink></li>
                    <li><NavLink href="/about">about</NavLink></li>
                    <li><NavLink href="/feedback">feedback</NavLink></li>
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