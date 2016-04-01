import React from "react";
import { BaseFactory, Base } from "../../components/Base";
import Overview from "../../components/Overview/index";
import Archives from "../../components/Archives/index";
import Article from "../../components/Article/index";
import NotFound from "../../components/Experiments/404/index";

export class ContentResolver {
    resolve(pathname: string): { path: string, factory: (data?: any) => JSX.Element } {
        if (pathname === "overview") {
            return {
                path: "/content/indexes/overview.json",
                factory: (data: any) => <Overview data={data}/>
            };
        }
        else if (pathname === "archives") {
            return {
                path: "/content/indexes/archives.json",
                factory: (data: any) => <Archives data={data}/>
            };
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
            return { path: null, factory: () => <NotFound/> };
        }
    }

    createNotFoundResolution() {
        const c = <div>Oops.Nothing here.</div>;
        let comp = BaseFactory.createElement(c, { title: "Not found" });
        return { path: null as string, factory: () => comp };
    }
}