import React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";
import { Overview, Archives, Article } from "./fragments/CoreViews";

export class ContentResolver {
    resolve(pathname: string) {
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
            return this.createNotFoundResolution();
        }
    }

    createNotFoundResolution() {
        const c = <div>Oops.Nothing here.</div>;
        let comp = BaseFactory.createElement(c, { title: "Not found" });
        return { path: null as string, factory: () => comp };
    }
}