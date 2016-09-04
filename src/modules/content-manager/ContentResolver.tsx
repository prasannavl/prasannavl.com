import React from "react";
import Overview from "../../components/Overview/index";
import Archives from "../../components/Archives/index";
import Article from "../../components/Article/index";
import Unknown from "../../components/Experiments/Unknown/index";
import { IAppContext } from "../core/AppContext";

export interface ContentResolution {
     contentPath: string;
     factory: (data?: any, context?: IAppContext) => JSX.Element;
}

export class ContentResolver {
    static DefaultPathKeyPrefix = "_#_";
    static InlineDataCacheKey = "__xDataCache__";
    static IsPrerenderedDomKey = "__xIsPrerenderedDom__";
    
    resolve(pathname: string): ContentResolution {
        let res: ContentResolution;
        res = this.tryResolveDirect(pathname);
        if (res.factory) return res;
        res = this.tryResolveContent(pathname);
        if (res.factory) return res;
        return this.getResolutionForFailure();
    }

    noResolution(): ContentResolution {
        return ContentResolver.CachedNoResolution;
    }

    getResolutionForFailure(): ContentResolution {
        return { contentPath: null, factory: () => <Unknown error="404"/> };
    }

    tryResolveContent(pathname: string): ContentResolution {
        const match = ContentResolver.isContentPath(pathname);
        if (match) {
            return {
                contentPath: "/content/" + match[0] + ".json",
                factory: data => <Article data={data} />
            };
        }
        return this.noResolution();
    }

    tryResolveDirect(pathname: string): ContentResolution {
        switch (pathname) {
            case "overview": {
                return {
                    contentPath: "/content/indexes/overview.json",
                    factory: data => <Overview data={data}/>
                };
            }
            case "about": {
                return {
                    contentPath: null,
                    factory: () => <Unknown error="000" documentTitle="About"/>
                };
            }
            case "projects": {
                return {
                    contentPath: null,
                    factory: () => <Unknown svgText="&lt;/&gt;" documentTitle="Projects" messageElement={getProjectsContentElement() }/>
                };
            }
        }
        if (pathname.match("archives(\/*)?")) {
            return {
                contentPath: "/content/indexes/archives.json",
                factory: (data, context) => {
                        return <Archives data={data} />;
                }
            };
        }
        return this.noResolution();
    }

    static isContentPath(pathname: string) {
        const contentRegex = /^((\d{4})\/(.*))\/?$/i;
        const match = contentRegex.exec(pathname);
        return match;
    }

    static CachedNoResolution = { contentPath: null, factory: null } as ContentResolution;
}

function getProjectsContentElement() {
    return (<div style={{ maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}><p style={{ fontSize: "23px" }}>Still working on this page. Meanwhile, here are some of my projects from GitHub: </p>
    <p>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/LiquidState"}>LiquidState</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/Liara"}>Liara</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/WinApi"}>WinApi</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/prasannavl.com"}>prasannavl.com</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/SharpLog"}>SharpLog</a>       
    <a className="button" target="_blank" href={"https://github.com/prasannavl/MongoSessionProvider"}>MongoSessionProvider</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/history-next"}>history-next</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/ConsoleUtils"}>ConsoleUtils</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/Wrex"}>Wrex</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/TextUtils"}>TextUtils</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/Benchmarks"}>Benchmarks</a>
    <a className="button" target="_blank" href={"https://github.com/prasannavl/MSP430-IR-Based-Codes"}>MSP430-IR-Based-Codes</a>
    </p></div>);
}

function getFeedbackLink() {
    const message = encodeURIComponent("@prasannavl, #weblog ");
    return `https://twitter.com/intent/tweet?text=${message}`;
}