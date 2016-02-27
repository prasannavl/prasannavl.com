import * as React from "react";
import Base from "../Base";

class Header extends Base<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <header>
                <h1 onClick={this.navigateTo.bind(this, "/")}>Prasanna V. Loganathar</h1>
                <h2>A <a href="https://xkcd.com/242/" target="_blank">mad-man</a> with a computer, walking the grove between <a href="http://what-if.xkcd.com/" target="_blank">Science</a> and <a href="https://xkcd.com/387/" target="_blank">Technology</a>.</h2>
            </header>
        );
        return c;
    }
}

export default Header;