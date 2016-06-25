import React from "react";
import { StatelessBase } from "../Base";
import createStyled from "../../modules/core/createStyled";
import marked from "marked";
import Footer from "../fragments/Footer";
import Link from "../fragments/Link";
import { ArticleDescriptor, ArticleHelper } from "../fragments/ArticleHelper";

let style = require("./style.scss") as any;

export interface ArchiveProps extends React.ClassAttributes<Archives> {
    data: any;
}

export class Archives extends StatelessBase<ArchiveProps> {    
    componentWillMount() {
        this.getServices().title.set("Archives");
    }

    renderSection(sectionTitle: string, sectionItems: Array<ArticleDescriptor>) {
        let sortedItems = sectionItems.sort((c, n) => n.date.localeCompare(c.date));
        let items = sectionItems.map(item => {
            return (<div key={item.url}>
                    <div className="title"><Link href={"/" + item.url}>{item.name}</Link></div>
                    <time>{ArticleHelper.getDateFromString(item.date).format("dddd, MMMM Do YYYY") }</time>
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
            <div>
                <h1>archives</h1>
                <main>
                    {sections}
                    <section>
                        <header><span className="year">the dark ages</span></header>
                        <br/><br/>
                    </section>
                </main>
            </div>
        </div>);
    }
}

export default createStyled(Archives, style);