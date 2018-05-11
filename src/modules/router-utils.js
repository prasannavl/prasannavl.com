import React from "react";
import { trimRightSlashes } from "./path-utils";

export const Link = ({ href, to, passHref, scroll, tag, replace, onClick, children, ...rest }) => {
    let itemTag = tag || "a";
    if (scroll !== false) {
        scroll = true;
    }
    const finalHref = href || to;

    let props = {
        ...rest,
        onClick: getDefaultLinkHandler({ 
            scroll,
            replace,
            onClick,
            href: finalHref,
        })
    };
    // If `a` tag, or if passHref is true, set the href prop, 
    // or else, set it data-href attribute.
    if (itemTag === "a" || passHref) {
        Object.assign(props, { href: finalHref });
    } else {
        Object.assign(props, { "data-href": finalHref });
    }
    return React.createElement(itemTag, props, children);
}

export function shouldDispatchDefaultClickEvent(e) {
    return (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}

export function getDefaultLinkHandler(props) {
    return function defaultLinkHandler(event) {
        if (shouldDispatchDefaultClickEvent(event)) return;
        const { scroll, replace, onClick, href: path } = props;
        if (onClick) onClick(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        // use timeout to keep screen responsive on mobile/low-end devices.
        setTimeout(() => {
            if (replace ||
                (trimRightSlashes(path) === trimRightSlashes(window.location.href)
                    && !window.location.search
                    && !window.location.hash)) {
                window.history.replaceState(null, undefined, path);
            } else {
                window.history.pushState(null, undefined, path);
            }
            window.dispatchEvent(new PopStateEvent('popstate', { state: { scroll } }));
        }, 0);
    }
}