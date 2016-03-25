import * as React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";
import Link from "../fragments/Link";
import * as request from "superagent";
import * as Promise from "bluebird";

export class ContentManager {

    getContentComponent(pathname: string): any {
        if (pathname === "overview") {
            return BaseFactory.createElement(React.createElement(LoremSegment, { count: 3 }), { title: "Overview" });
        }
        const contentRegex = /(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            const c = <div>{match[1]} - {match[2]}</div>;
            return BaseFactory.createElement(c, { title: "Matchyman" });
        }
        else {
            const c = <div>Oops.Nothing here.</div>;
            return BaseFactory.createElement(c, { title: "Not found" });
        }
    }

    getRawContentAsync(path: string) {
        let p = Promise.defer();
        if (__DOM__) {
            request.get(path)
                .end((err, res) => {
                    if (err) p.reject(err);
                    else p.resolve(res);
                });
        } else {
            
        }
    }
}
