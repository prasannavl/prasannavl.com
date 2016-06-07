import React from "react";
import ReactDOM from "react-dom";
import { StatelessBase } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import { ViewUtils } from "../../modules/utils/index";
import Footer from "../fragments/Footer";
import Link from "../fragments/Link";
import { ArticleHelper, ArticleDescriptor } from "../fragments/ArticleHelper";

export interface ArticleProps extends React.ClassAttributes<Overview> {
    data: Array<ArticleDescriptor>;
}

export class Overview extends StatelessBase<ArticleProps> {
    private _articleDomElements: Array<HTMLElement>;

    componentWillMount() {
        this.getServices().title.set("Overview");
    }

    onUpdate() {
        this._articleDomElements.forEach(x => ViewUtils.captureRouteLinks(this, x));
    }

    componentDidMount() {
        this.onUpdate();
    }

    renderItem(item: ArticleDescriptor) {
        return (<section key={item.url}>
            <header>
                <h2><Link href={"/" + item.url}>{item.name.toLowerCase() }</Link></h2>
                {item.date ? ArticleHelper.renderDate(item.date) : null }
                {item.tags && item.tags.length > 0 ? ArticleHelper.renderTagList(item.tags) : null }
            </header>
            <article
                dangerouslySetInnerHTML={{ __html: marked(item.content) }}
                ref={(r) => r && this._articleDomElements.push(r) }>
            </article>
            <div className="readmore">
                <Link href={"/" + item.url}>
                    read more &raquo;
                </Link>
            </div>
        </section>);
    }

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let data = this.props.data;

        let items = data.map(item => this.renderItem(item));
        return (<div className={style.root}>
            <main>
                {items}
                <Footer></Footer>
            </main>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Overview, style);