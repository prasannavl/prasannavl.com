import React from "react";
import { Base } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import { ViewUtils, ViewItemDescriptor } from "../../modules/utils/index";

export class Overview extends Base<any, any> {
    private _articleDomElements: Array<HTMLElement>;

    componentWillMount() {
        this.getServices().title.set("Overview");
    }

    componentDidMount() {
        this._articleDomElements.forEach(x => ViewUtils.captureRouteLinks(this, x));
    }

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let data = this.props.data as Array<ViewItemDescriptor>;
        let items = data.map(item => {
            return (<section key={item.url}>
                <header>
                    <h2><a href={item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name.toLowerCase()}</a></h2>
                    <time>{ViewUtils.formatDate(item.date).toLowerCase() }</time>
                </header>
                <article dangerouslySetInnerHTML={{ __html: marked(item.content) }} ref={(r) => this._articleDomElements.push(r) }></article>
            </section>);
        });
        return <div className={style.root}>{items}</div>;
    }
}

let style = require("./style.scss") as any;
export default createStyled(Overview, style);