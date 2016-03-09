import * as React from "react";
import { Base } from "../Base";
import shallowCompare from "react-addons-shallow-compare";

// export default class Link extends Base<any, any> {
//     displayName = "Link";

//     constructor() {
//         super();
//         this.onClick = this.onClick.bind(this);
//     }

//     isActive() {
//         return this.getPath() === this.props.href;
//     }

//     onClick(e: any) {
//         if (this.props.onClick) {
//             this.props.onClick(e);
//         }
//         if (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)
//             return;

//         if (!e.defaultPrevented) {
//             e.preventDefault();
//             this.navigateTo(this.props.href);
//         }
//     }

//     render() {
//         let classNames = this.props.className;
//         const href = this.makeHref(this.props.href);
//         if (this.props.activeClassName && this.isActive()) {
//             classNames += " " + this.props.activeClassName;
//         }
//         const props = Object.assign({}, this.props, {
//             onClick: this.onClick,
//             href: href,
//             className: classNames
//         });
//         return React.DOM.a(props, this.props.children);
//     }
// }