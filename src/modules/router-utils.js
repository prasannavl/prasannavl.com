import React from "react";
import { trimRightSlashes } from "./path-utils";

export const Link = ({ href, to, passHref, scroll, tag, replace, children, ...rest }) => {
    let itemTag = tag || "a";
    if (scroll !== false) {
        scroll = true;
    }
    let props = { ...rest, onClick: linkClickHandler, "data-scroll": scroll, "data-replace": replace };
    // If `a` tag, or if passHref is true, set the href prop, 
    // or else, set it data-href attribute.
    if (itemTag === "a" || passHref) {
        Object.assign(props, { href: href || to });
    } else {
        Object.assign(props, { "data-href": href || to });
    }
    return React.createElement(itemTag, props, children);
}

const linkClickHandler = (event) => {
    event.preventDefault();
    let target = event.currentTarget;
    const path = target.href || target.getAttribute("data-href");
    const scroll = target.getAttribute("data-scroll");
    const replace = target.getAttribute("data-replace");
    if (replace ||
        (trimRightSlashes(path) === trimRightSlashes(window.location.href)
            && !window.location.search
            && !window.location.hash)) {
        window.history.replaceState(null, undefined, path);
    } else {
        window.history.pushState(null, undefined, path);
    }
    window.dispatchEvent(new PopStateEvent('popstate', { state: { scroll } }));
}