import * as React from "react";
import { StatelessBase } from "../Base";

export default class Header extends StatelessBase<any> {
    render() {
        const c = (
            <h2 {...this.props}><span>A </span><a href="https://xkcd.com/242/" target="_blank">mad-man</a> <span>with a computer, walking the grove between </span><a href="https://what-if.xkcd.com/" target="_blank">Science</a><span> and </span><a href="https://xkcd.com/387/" target="_blank">Technology</a><span>.</span></h2>
        );
        return c;
    }
}