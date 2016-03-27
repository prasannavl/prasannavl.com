import * as React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";
import Link from "../fragments/Link";
import * as request from "superagent";
import * as marked from "marked";
import * as Rx from "rxjs";
import { EventEmitter } from "events";
import * as path from "path";

export class ContentManager extends EventEmitter {
    static contentEventName = "content";

    resolveContent(pathname: string) {
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
            }
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

    loadPath(pathname: string) {
        let resolved = this.resolveContent(pathname);
        if (resolved.path !== null) {
            this.getContentAsync(resolved.path)
                .then(x => this.emit(ContentManager.contentEventName, resolved.factory(x)));
        } else {
            this.emit(ContentManager.contentEventName, resolved.factory(null));
        }
    }

    loadPathSync(pathname: string) {
        if (!__DOM__) {
            let resolved = this.resolveContent(pathname);
            let content = null as any;
            if (resolved.path !== null) {
                content = require("../../../static" + resolved.path);
            }
            return resolved.factory(content);
        }
        return null;
    }

    getContentAsync(path: string) {
        return new Promise((resolve, reject) => {
            request.get(path)
                .end((err, res) => {
                    if (err) reject(err);
                    else resolve(res.body);
                });
        });
    }
}
