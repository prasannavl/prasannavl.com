import React from "react";
import { BaseFactory, Base } from "../../components/Base";
import Overview from "../../components/Overview/index";
import Archives from "../../components/Archives/index";
import Article from "../../components/Article/index";
import Unknown from "../../components/Experiments/Unknown/index";

export class ContentResolver {
    resolve(pathname: string): { path: string, factory: (data?: any) => JSX.Element } {
        if (pathname === "overview") {
            return {
                path: "/content/indexes/overview.json",
                factory: (data: any) => <Overview data={data}/>
            };
        } else if (pathname === "archives") {
            return {
                path: "/content/indexes/archives.json",
                factory: (data: any) => <Archives data={data}/>
            };
        } else if (pathname === "about") {
            return { path: null, factory: () => <Unknown error="000" documentTitle="About"/> };
        }
        const contentRegex = /((\d{4})\/(.*))/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            return {
                path: "/content/" + match[0] + ".json",
                factory: (data: any) => <Article data={data}/>
            };
        }
        else {
            return { path: null, factory: () => <Unknown error="404"/> };
        }
    }
}