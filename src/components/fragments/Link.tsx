import * as React from "react";
import { StatelessBase } from "../Base";
import shallowCompare from "react-addons-shallow-compare";

export default class Link extends StatelessBase<any, any> {
    displayName = "Link";

    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    onClick(e: any) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
            return;

        if (!e.defaultPrevented) {
            e.preventDefault();
            this.navigateTo(this.props.href);
        }
    }

    render() {
        const props = Object.assign({}, this.props, {
            onClick: this.onClick,
            href: this.makeHref(this.props.href)
        });
        return React.DOM.a(props, this.props.children);
    }
}