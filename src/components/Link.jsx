import React from "react";
export { linkHandler } from "../modules/router";

const Link = ({ href, to, passHref, scroll, tag, replace, state, onClick, children, ...rest }) => {
    let itemTag = tag || "a";
    const finalHref = href || to;

    let props = {
        ...rest,
        onClick: linkHandler({ 
            scroll,
            replace,
            state,
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

export default Link;