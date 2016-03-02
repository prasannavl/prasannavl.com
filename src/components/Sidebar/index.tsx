import * as React from "react";
import Base from "../Base";
import Tagline from "../fragments/Tagline";
import createStyled from "../../modules/core/createStyled";

let style = require("./style.scss") as any;

class Sidebar extends Base<any, any> {

    render() {
        const c = (
            <div className={style.root} {...this.props}>
                <header>
                    <h1>
                        <a href="/" onClick={(ev) => this.navigateTo.call(this, "/", ev) }>Prasanna V. Loganathar</a>
                    </h1>
                     <Tagline className="tagline" />
                </header>
                <nav>
                    <li className="highlight">overview</li>
                    <li>archives</li>
                    <li>about</li>
                    <li>feedback</li>
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