import React from "react";
import ReactDOM from "react-dom";
import { StatelessBase } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import { ViewUtils, ViewItemDescriptor } from "../../modules/utils/index";
import Footer from "../fragments/Footer";
import Link from "../fragments/Link";
import { TagHelper } from "../Shared/TagHelper";

export class Overview extends StatelessBase<any> {
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

    renderItem(item: ViewItemDescriptor) {
        return (<section key={item.url}>
            <header>
                <h2><Link href={"/" + item.url}>{item.name.toLowerCase() }</Link></h2>
                <Link href="/archives" className="date"><time dateTime={item.date}>{ ViewUtils.formatDate(item.date).toLowerCase() }</time></Link>
                {TagHelper.renderTagList(item.tags)}
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
        let data = this.props.data as Array<ViewItemDescriptor>;

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