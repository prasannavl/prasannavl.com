import React from "react";
import { StatelessBase } from "../Base";
import createStyled from "../../modules/core/createStyled";
import marked from "marked";
import { ViewUtils, ViewItemDescriptor } from "../../modules/utils/index";
import Footer from "../fragments/Footer";

export class Archives extends StatelessBase<any> {
    componentWillMount() {
        this.getServices().title.set("Archives");
    }

    renderSection(sectionTitle: string, sectionItems: Array<ViewItemDescriptor>) {
        let sortedItems = sectionItems.sort((c, n) => n.date.localeCompare(c.date));
        let items = sectionItems.map(item => {
            return (<div key={item.url}>
                    <a href={"/" + item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name}</a>
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
        let sectionKeys = Object.keys(data).sort((c, n) => n.localeCompare(c));
        let sections = sectionKeys.map(x => this.renderSection(x, data[x]));
        return (<div className={style.root}>
            <h1>archives</h1>
            <main>
                {sections}
                <section>
                    <header><span className="year">the dark ages</span></header>
                </section>
            </main>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Archives, style);