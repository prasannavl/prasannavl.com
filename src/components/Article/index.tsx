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

    private _scrollEventSubject = new Rx.Subject<any>();
    private _delayedScrollEventTriggerSubject = new Rx.Subject<any>();
    private _scrollEventSubscription: Rx.Subscription;
    private _scrollNativeEventSubscription: Rx.Subscription;

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
        this.ensureSubscriptions();
        this._delayedScrollEventTriggerSubject.next(null);
    }

    ensureSubscriptions() {
        if (!this._scrollEventSubscription || this._scrollEventSubscription.isUnsubscribed) {
            this._scrollEventSubscription = this._scrollEventSubject.subscribe(() => {
                this.validateCommentView();
            });
        }
        if (!this._scrollNativeEventSubscription || this._scrollNativeEventSubscription.isUnsubscribed) {
            let view = document.getElementById("content-view");
            if (view) {
                this._scrollNativeEventSubscription = Rx.Observable.fromEvent(view, "scroll")
                    .merge(this._delayedScrollEventTriggerSubject.delay(1000))
                    .debounceTime(300)
                    .subscribe(this._scrollEventSubject);
            }
        }
    }

    validateCommentView() {
        let el = this.refs["extContainer"] as HTMLElement;
        if (this.getViewportHeightOffset(el) > -120) {
            this.disposeSubscriptions();
            showGoogleAds();
            loadComments(this.getCurrentHistoryContext().pathname);
        }
    }

    getViewportHeightOffset(element: HTMLElement) {
        if (element == null) return;
        let offset = (window.innerHeight || document.documentElement.clientHeight) - element.getBoundingClientRect().top;
        return offset;
    }

    disposeSubscriptions() {
        if (this._scrollNativeEventSubscription && !this._scrollNativeEventSubscription.isUnsubscribed)
            this._scrollNativeEventSubscription.unsubscribe();
        if (this._scrollEventSubscription && !this._scrollEventSubscription.isUnsubscribed)
            this._scrollEventSubscription.unsubscribe();
    }

    componentWillUnmount() {
        this.disposeSubscriptions();
        super.componentWillUnmount();
    }

    render() {
        this._articleDomElements = new Array<HTMLElement>();
        let item = this.props.data;
        return (
            <div className={style.root}>
                <div id="article-items-container">
                    <main>
                        <header>
                            <h1>{ "PVL ".toLocaleLowerCase() + "\u2215" + " " }
                                <Link href={"/" + item.url}>
                                    {item.name.toLowerCase() }
                                </Link></h1>
                            {ArticleHelper.renderDate(item.date) }
                            {ArticleHelper.renderTagList(item.tags) }
                        </header>
                        <article dangerouslySetInnerHTML={{ __html: marked(item.content) }} ref={(r) => r && this._articleDomElements.push(r) }></article>
                    </main>
                    <div ref="extContainer" className="ext-container">
                        <ins className="adsbygoogle ads-text"
                            style={{ display: "block" }}
                            data-ad-client="ca-pub-1693387204520380" data-ad-slot="5530147693" data-ad-format="link">
                        </ins>
                        <div id="disqus_thread"></div>
                    </div>
                    <Footer/>
                </div>
        </div>);
    }
}

let style = require("./style.scss") as any;
export default createStyled(Article, style);