import React from "react";
import ReactDOM from "react-dom";
import { Base } from "../Base";
import { cleanPathNameSlashses } from "history-next/lib/utils";
import { StringUtils } from "../../modules/utils/CoreUtils";

export interface LinkProps extends React.Props<Link> {
    href: string;
    activeClassName?: string;
    className?: string;
    onClick?: (ev: React.SyntheticEvent) => void;
    replaceState?: boolean;
}

export default class Link extends Base<LinkProps, any> {
    constructor(props: LinkProps, context: any) {
        super(props, context);
        this.onClick = this.onClick.bind(this);
    }

    isActive() {
        const historyContext = this.context.historyContext;
        if (!historyContext) return false;
        return historyContext.pathname === cleanPathNameSlashses(this.props.href);
    }

    onClick(e: React.MouseEvent) {
        if (this.props.onClick) {
            this.props.onClick(e);
        }

        if (e.defaultPrevented || e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
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

