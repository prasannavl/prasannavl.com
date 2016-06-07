import React from "react";
import Link from "../fragments/Link";
import { ViewUtils } from "../../modules/utils/index";
import moment from "moment";

export interface ArticleDescriptor {
    name: string;
    url: string;
    date: string;
    tags: Array<string>;
    content: string;
    title: string;
}

export class ArticleHelper {
    static renderTagList(tags: Array<string>) {
        let links = Array<JSX.Element>(tags.length);
        let len = tags.length;
        tags.forEach((tag, i) => {
            let displayTag = tag;
            links.push(<span><Link href={"/archives/tags/" + displayTag.toLowerCase()}>{displayTag}</Link>{i < len - 1 ? " | " : ""}</span>)
        });

        return (<div className="tags">
            <span className="title">Tags</span>
            {links}
        </div>);
    }

    static getDateFromString(dateString: string) {
        return moment(dateString);
    }

    static renderDate(dateString: string) {
        let m = ArticleHelper.getDateFromString(dateString);
        let date = m.format("dddd, MMMM Do YYYY");
        
        return (<Link href={"/archives/" + m.year() + "/"} className="date">
            <time dateTime={dateString}>
                {date}
            </time>
        </Link>);
    }
}