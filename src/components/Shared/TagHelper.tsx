import React from "react";
import Link from "../fragments/Link";

export class TagHelper {
    static renderTagList(tags: Array<string>) {
        let links = Array<JSX.Element>(tags.length);
        let len = tags.length;
        tags.forEach((tag, i) => {
            links.push(<span><Link href="/archives">{tag.toLowerCase() }</Link>{i < len - 1 ? " | " : ""}</span>)
        });

        return (<div className="tags">
            <span className="title">tags</span>
            {links}
        </div>);
    }
}