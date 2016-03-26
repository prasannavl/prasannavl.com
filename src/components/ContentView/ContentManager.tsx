import * as React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";
import Link from "../fragments/Link";
import * as request from "superagent";
import * as marked from "marked";
import * as Rx from "rxjs";

export class ContentManager {

    contentStream = new Rx.Subject();

    resolvePath(pathname: string) {
        if (pathname === "overview") {
            this.getContentAsync("/content/indexes/overview.json")
                .then(data => {
                    let comp = BaseFactory.createElement(<div dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}></div>, { title: "Overview" });
                    this.contentStream.next(comp);
                });
        } else if (pathname === "archives") {
            this.getContentAsync("/content/indexes/archives.json")
                .then(data => {
                    let comp = BaseFactory.createElement(<div dangerouslySetInnerHTML={{ __html: JSON.stringify(data, null, 2) }}></div>, { title: "Overview" });
                    this.contentStream.next(comp);
                });
        }
        const contentRegex = /(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            const c = <div>{match[1]} - {match[2]}</div>;
            let comp = BaseFactory.createElement(c, { title: "Matchyman" });
            this.contentStream.next(comp);
        }
        else {
            const c = <div>Oops.Nothing here.</div>;
            let comp = BaseFactory.createElement(c, { title: "Not found" });
            this.contentStream.next(comp);
        }
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
