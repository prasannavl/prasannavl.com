import React from "react";
import Overview from "../../components/Overview/index";
import Archives from "../../components/Archives/index";
import Article from "../../components/Article/index";
import Unknown from "../../components/Experiments/Unknown/index";

export interface ContentResolution {
     contentPath: string;
     factory: (data?: any) => JSX.Element;
}

export class ContentResolver {
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
        const contentRegex = /((\d{4})\/(.*))/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            return {
                contentPath: "/content/" + match[0] + ".json",
                factory: data => <Article data={data}/>
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
            case "archives": {
                return {
                    contentPath: "/content/indexes/archives.json",
                    factory: data => <Archives data={data}/>
                };
            }
            case "about": {
                return {
                    contentPath: null,
                    factory: () => <Unknown error="000" documentTitle="About"/>
                };
            }
        }
        return this.noResolution();
    }

    static CachedNoResolution = { contentPath: null, factory: null } as ContentResolution;
}