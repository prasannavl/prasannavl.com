import React from "react";
import ReactDOM from "react-dom";
import { Base } from "../Base";
import { cleanPathNameSlashses } from "history-next/lib/utils";
import { StringUtils } from "../../modules/utils/CoreUtils";
import { DomUtils } from "../../modules/utils/DomUtils";

export interface LinkProps extends React.HTMLProps<Link> {
    activeClassName?: string;
    replaceState?: boolean;
    activeClassMatcher?: (component: Link) => boolean;
}

export default class Link extends Base<LinkProps, any> {
    constructor(props: LinkProps, context: any) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
    }

    isActive() {
        let matcher = this.props.activeClassMatcher || defaultMatcher;
        return matcher(this);
    }

    onClick(e: React.MouseEvent) {
        if (DomUtils.shouldDispatchDefaultClickEvent(e)) return;        
        if (this.props.onClick) {
            this.props.onClick(e);
        }
        if (e.defaultPrevented) return;
        this.navigateTo(this.props.href, this.props.replaceState, e);
    }

    render() {
        let classNames = this.props.className;
        const href = this.props.href;
        if (this.props.activeClassName && this.isActive()) {
           classNames = StringUtils.joinWithSpaceIfNotEmpty(classNames, this.props.activeClassName);
        }
        const props = Object.assign({}, this.props, {
            onClick: this.onClick,
            href: href,
            className: classNames
        });
        return React.DOM.a(props, this.props.children || href);
    }
}

export function defaultMatcher(component: Link) {
    const historyContext = component.getCurrentHistoryContext();
    if (!historyContext) return false;
    let currentPath = historyContext.pathname;
    return currentPath === cleanPathNameSlashses(component.props.href);
}

export function startsWithMatcher(component: Link) {
    const historyContext = component.getCurrentHistoryContext();
    if (!historyContext) return false;
    let currentPath = historyContext.pathname;
    return currentPath.startsWith(cleanPathNameSlashses(component.props.href));
}
