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
    return (<div style={{ maxWidth: 960, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ maxWidth: 520, marginLeft: "auto", marginRight: "auto", paddingBottom: "10px" }}>
            <p style={{ fontSize: "23px" }}>Still working on this page. Meanwhile, here are some of my open source projects from GitHub.</p>
        </div>
        <p>{getProjects() }</p></div>);
}

function getProjects() {
    let p = ["LiquidState", "Liara", "WinApi",
        "prasannavl.com", "SharpLog", "MongoSessionProvider",
        "history-next", "ConsoleUtils", "Wrex",
        "TextUtils", "Benchmarks", "MSP430-IR-Based-Codes"];
    return p.map(x => getLinkElementForProject(x));
}

function getLinkElementForProject(project: string) {
    const url = "https://github.com/prasannavl/" + project;
    return (<a className="button" target="_blank" href={ url } key={project}>{project}</a>);
}