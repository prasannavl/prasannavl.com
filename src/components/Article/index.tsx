import React from "react";
import { StatelessBase } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import Footer from "../fragments/Footer";
import { loadComments } from "../../modules/ext/disqus";
import { show as showGoogleAds } from "../../modules/ext/googleAdSense";
import Rx from "rxjs";
import ReactDOM from "react-dom";
import Link from "../fragments/Link";
import { ViewUtils } from "../../modules/utils/index";
import { ArticleHelper, ArticleDescriptor } from "../fragments/ArticleHelper";

export interface ArticleProps extends React.ClassAttributes<Article> {
    data: ArticleDescriptor;
}

export class Article extends StatelessBase<ArticleProps> {
    private _articleDomElements: Array<HTMLElement>;

    setupTitle() {
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

    componentWillMount() {
        this.setupTitle();
    }

    componentDidMount() {
        this.onUpdate();
    }

    componentDidUpdate() {
        this.setupTitle();
        this.onUpdate();
    }

    onUpdate() {
        this._articleDomElements.forEach(x => ViewUtils.captureRouteLinks(this, x));
        setTimeout(() => showGoogleAds(), 20);
        setTimeout(() => loadComments(this.getCurrentHistoryContext().pathname, this.props.data.name), 40);   
    }

    componentWillUnmount() {
        super.componentWillUnmount();
    }

    renderHeader(item: ArticleDescriptor) {
        let heading: JSX.Element = null;
        if (item.name) {
            heading = (<h1>{ "pvl " + "\u2215" + " " }
                <Link href={"/" + item.url}>
                    {item.name}
                </Link></h1>);
        }
        return (<header>
            {heading}   
            {item.date ? ArticleHelper.renderDate(item.date) : null }
            {item.tags && item.tags.length > 0 ? ArticleHelper.renderTagList(item.tags) : null }
        </header>);
    }

    // renderMediaAdFromGoogle() {
    //     return (
    //         <ins className="adsbygoogle ads-text"
    //             style={{ display: "block"  }}
    //             data-ad-client="ca-pub-1693387204520380"
    //             data-ad-slot="8634084491"
    //             data-ad-format="auto"></ins>
    //     );
    // }

    // renderMediaAd2FromGoogle() {
    //     return (
    //         <ins className="adsbygoogle"
    //             style={{ display: "inline-block", width: "728px", height: "90px" }}
    //             data-ad-client="ca-pub-1693387204520380"
    //             data-ad-slot="1110817699"></ins>
    //     );
    // }

    renderTextAdFromGoogle() {
        return (<ins className="adsbygoogle ads-text"
            style={{ display: "block" }}
            data-ad-client="ca-pub-1693387204520380" data-ad-slot="5530147693" data-ad-format="link">
        </ins>);
    }

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let item = this.props.data;
        return (
            <div className={style.root}>
                <div id="article-items-container">
                    <main>
                        {this.renderHeader(item)}
                        <article dangerouslySetInnerHTML={{ __html: marked(item.content) }} ref={(r) => r && this._articleDomElements.push(r) }></article>
                    </main>
                    <div ref="extContainer" className="ext-container">
                        { this.renderTextAdFromGoogle() }
                        <div id="disqus_thread"></div>
                    </div>
                    <Footer/>
                </div>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Article, style);