import React from "react";
import { Base } from "../../components/Base";
import moment from "moment";

export interface ViewItemDescriptor {
    name: string;
    url: string;
    date: string;
    tags: Array<string>;
    content: string;
}

export class ViewUtils {
    static formatDate(dateString: string) {
        let m = moment(dateString);
        return m.format("dddd, MMMM Do YYYY");
    }
    static captureRouteLinks(baseComponent: Base<any, any>, element: HTMLElement) {
        let links = element.getElementsByClassName("route");
        for (let i = 0; i < links.length; i++) {
            let link = links[i] as HTMLLinkElement;
            link.onclick = (ev) => { baseComponent.navigateTo(link.href, false, ev); };
        }
    }
}