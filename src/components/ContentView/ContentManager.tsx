import * as React from "react";
import { LoremSegment } from "../fragments/Lorem";
import { BaseFactory, Base } from "../Base";
import Link from "../fragments/Link";

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

    getRawContent(path: string) {
        
    }
}
