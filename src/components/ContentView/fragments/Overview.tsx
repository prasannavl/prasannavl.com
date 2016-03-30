import React from "react";
import { Base } from "../../Base";
import marked from "marked";
import moment from "moment";

export class Overview extends Base<any, any> {

    static formatDate(dateString: string) {
        let m = moment(dateString);
        return m.format("dddd, MMMM Do YYYY");
    }

    componentWillMount() {
        this.getServices().title.set("Overview");
    }

    captureRouteLinks(element: HTMLElement) {
        let links = element.getElementsByClassName("route");
        for (let i = 0; i < links.length; i++) {
            let link = links[i] as HTMLLinkElement;
            link.onclick = (ev) => { this.navigateTo(link.href, false, ev); };
        }
    }

    render() {
        let data = this.props.data as Array<{ name: string, url: string, date: string, tags: Array<string>, content: string }>;
        let items = data.map(item => {
            return (<section key={item.url}>
                <header>
                    <h2><a href={item.url} onClick={(ev) => this.navigateTo(item.url, false, ev)}>{item.name}</a></h2>
                    <time>{Overview.formatDate(item.date)}</time>
                </header>
                <article dangerouslySetInnerHTML={{ __html: marked(item.content) }}>
                </article>
            </section>);
        });
        return <div>{items}</div>;
    }
}

export default Overview;