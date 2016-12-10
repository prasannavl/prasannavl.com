import React from "react";
import { StatelessBase } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import Footer from "../fragments/Footer";
import { loadComments } from "../../modules/ext/disqus";
import { HighlightJs } from "../../modules/ext/highlight";
import Rx from 'rxjs';
import ReactDOM from "react-dom";
import Link from "../fragments/Link";
import { ViewUtils } from "../../modules/app-utils/index";
import { ArticleHelper, ArticleDescriptor } from "../fragments/ArticleHelper";

export interface ArticleProps extends React.ClassAttributes<Article> {
    data: ArticleDescriptor;
}

export class Article extends StatelessBase<ArticleProps> {
    private _articleDomElements: Array<HTMLElement>;
    private _highligher: HighlightJs;

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
        this._highligher = new HighlightJs();
        this.onUpdate();
    }

    componentWillUpdate() {
        this._articleDomElements = [];
    }

    componentDidUpdate() {
        this.setupTitle();
        this.onUpdate();
    }

    onUpdate() {
        this._articleDomElements.forEach(x => ViewUtils.captureRouteLinks(this, x));
        setTimeout(() => loadComments(this.getCurrentHistoryContext().pathname, this.props.data.name), 20);
        setTimeout(() => this.highlightCodeBlocks(), 100);
    }

    highlightCodeBlocks() {
        this._highligher.executeInitialized(() => {
            this._articleDomElements.forEach(x => {
                let items = x.querySelectorAll("pre code");
                if (items == null) return;
                let blocks = Array.from(items);
                let hljs = (window as any)["hljs"];
                if (hljs) {
                    blocks.forEach(b => hljs.highlightBlock(b));
                }
            });
        });
    }

    componentWillUnmount() {
        this._articleDomElements = [];
        super.componentWillUnmount();
    }

    renderHeader(item: ArticleDescriptor) {
        let heading: JSX.Element = null;        
        if (item.name) {
            heading = (<h1>
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

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let item = this.props.data;
        return (
            <div className={style.root}>
                <div>
                    <main>
                        {this.renderHeader(item)}
                        <article dangerouslySetInnerHTML={{ __html: marked(item.content) }} ref={(r) => r && this._articleDomElements.push(r) }></article>
                    </main>
                    <div className="ext-container">
                        <div id="disqus_thread"></div>
                    </div>
                    <Footer/>
                </div>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Article, style);