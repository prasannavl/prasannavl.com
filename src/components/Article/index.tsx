import React from "react";
import { StatelessBase } from "../Base";
import marked from "marked";
import createStyled from "../../modules/core/createStyled";
import { ViewUtils, ViewItemDescriptor } from "../../modules/utils/index";
import Footer from "../fragments/Footer";
import { loadComments } from "../../modules/ext/disqus";

export class Article extends StatelessBase<any> {
    private _articleDomElements: Array<HTMLElement>;
    private _commentTimer: NodeJS.Timer;

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

    componentDidUpdate() {
        this.setupTitle();
        this.onUpdate();
    }

    onUpdate() {
        this._articleDomElements.forEach(x => ViewUtils.captureRouteLinks(this, x));
        this._commentTimer = setTimeout(() => {
                loadComments(this.context.historyContext.pathname);
                this._commentTimer = null;
        }, 2000);
    }

    componentDidMount() {
        this.onUpdate();
    }

    componentWillUnmount() {
        if (this._commentTimer) {
            clearTimeout(this._commentTimer);
        }
        super.componentWillUnmount();
    }

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let item = this.props.data as ViewItemDescriptor;
        return (<div className={style.root}>
            <section>
                <header>
                    <h2><a href={"/" + item.url} onClick={(ev) => this.navigateTo(item.url, false, ev) }>{item.name.toLowerCase()}</a></h2>
                    <time>{ViewUtils.formatDate(item.date).toLowerCase() }</time>
                </header>
                <article dangerouslySetInnerHTML={{ __html: marked(item.content) }} ref={(r) => r && this._articleDomElements.push(r) }></article>
            </section>
            <div id="disqus_thread"></div>
            <Footer/>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Article, style);