import * as React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";

export class ContentResolver {
    resolve(pathname: string) {
        if (pathname === "overview") {
            return {
                path: "/content/indexes/overview.json",
                factory: (data: any) =>
                    BaseFactory.createElement(
                        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}></div>,
                        { title: "Overview" })
            };
        }
        else if (pathname === "archives") {
            return {
                path: "/content/indexes/archives.json",
                factory: (data: any) =>
                    BaseFactory.createElement(
                        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}></div>,
                        { title: "Archives" })
            };
        }
        const contentRegex = /(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            const c = <div>{match[1]} - {match[2]}</div>;
            let comp = BaseFactory.createElement(c, { title: "Matchyman" });
            return { path: null, factory: () => comp };
        }
        else {
            const c = <div>Oops.Nothing here.</div>;
            let comp = BaseFactory.createElement(c, { title: "Not found" });
            return { path: null, factory: () => comp };
        }
    }
}