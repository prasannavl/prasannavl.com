import React from "react";
import { StatelessBase } from "../Base";

export default class Header extends StatelessBase<any> {
    render() {
        const c = (
            <h2 {...this.props}><span>A 20-something </span><a href="https://xkcd.com/242/" target="_blank">mad-man</a>, and a <a href="https://xkcd.com/387/" target="_blank">technology architect</a>.<span></span></h2>
        );
        return c;
    }
}