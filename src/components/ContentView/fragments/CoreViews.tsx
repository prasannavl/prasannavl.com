import React from "react";
import { Base } from "../../Base";
import marked from "marked";
import moment from "moment";

interface ItemDescriptor {
    name: string;
    url: string;
    date: string;
    tags: Array<string>;
    content: string;
}

export function formatDate(dateString: string) {
    let m = moment(dateString);
    return m.format("dddd, MMMM Do YYYY");
}

export function captureRouteLinks(baseComponent: Base<any, any>, element: HTMLElement) {
    let links = element.getElementsByClassName("route");
    for (let i = 0; i < links.length; i++) {
        let link = links[i] as HTMLLinkElement;
        link.onclick = (ev) => { baseComponent.navigateTo(link.href, false, ev); };
    }
}

export class Overview extends Base<any, any> {
    componentWillMount() {
        this.getServices().title.set("Overview");
    }

    render() {
        let data = this.props.data as Array<ItemDescriptor>;
        let items = data.map(item => {
            return (<section key={item.url}>
                <header>
                    <h2><a href={item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name}</a></h2>
                    <time>{formatDate(item.date) }</time>
                </header>
                <article dangerouslySetInnerHTML={{ __html: marked(item.content) }}></article>
            </section>);
        });
        return <div>{items}</div>;
    }
}

export class Archives extends Base<any, any> {
    componentWillMount() {
        this.getServices().title.set("Archives");
    }

    renderSection(sectionTitle: string, sectionItems: Array<ItemDescriptor>) {
        let items = sectionItems.map(item => {
            return (<div key={item.url}>
                <h2><a href={item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name}</a></h2>
                <time>{formatDate(item.date) }</time>
            </div>);
        });
        return <section key={sectionTitle}>
            <header>{sectionTitle}</header>
            {items}
        </section>;
    }

    render() {
        let data = this.props.data;
        let sections = Object.keys(data).map(x => this.renderSection(x, data[x]));
        return <div>{sections}</div>;
    }
}

export class Article extends Base<any, any> {
    componentWillMount() {
        const { name, title } = this.props.data;
        let titleService = this.getServices().title;
        if (title !== undefined) {
            if (title !== null) {
                titleService.set(title);
            } else {
                titleService.reset();
            }
        } else {
            if (name != null) {
                titleService.set(name);
            } else {
                titleService.reset();
            }
        }
    }

    render() {
        let item = this.props.data as ItemDescriptor;
        return (<section>
            <header>
                <h2><a href={item} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name}</a></h2>
                <time>{formatDate(item.date) }</time>
            </header>
            <article dangerouslySetInnerHTML={{ __html: marked(item.content) }}></article>
        </section>);
    }
}