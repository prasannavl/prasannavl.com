import React from "react";
import { Base } from "../../components/Base";

export class ViewUtils {
    static captureRouteLinks(baseComponent: Base<any, any>, element: HTMLElement, className = "route") {
        let links = element.getElementsByClassName(className);
        for (let i = 0; i < links.length; i++) {
            let link = links[i] as HTMLLinkElement;
            link.onclick = (ev) => { baseComponent.navigateTo(link.href, false, ev); };
        }
    }
}