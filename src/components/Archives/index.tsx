import React from "react";
import { Base } from "../Base";
import createStyled from "../../modules/core/createStyled";
import marked from "marked";
import { ViewUtils, ViewItemDescriptor } from "../../modules/utils/index";
import Footer from "../fragments/Footer";

export class Archives extends Base<any, any> {
    componentWillMount() {
        this.getServices().title.set("Archives");
    }

    renderSection(sectionTitle: string, sectionItems: Array<ViewItemDescriptor>) {
        let items = sectionItems.map(item => {
            return (<div key={item.url}>
                    <a href={item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name}</a>
                    <time>{ViewUtils.formatDate(item.date) }</time>
            </div>);
        });
        return <section  key={sectionTitle}>
            <header><span className="year">{sectionTitle}</span></header>
            {items}
        </section>;
    }

    render() {
        let data = this.props.data;
        let sections = Object.keys(data).map(x => this.renderSection(x, data[x]));
        return <div className={style.root}><h2>archives</h2>{sections}</div>;
    }
}

let style = require("./style.scss") as any;
export default createStyled(Archives, style);