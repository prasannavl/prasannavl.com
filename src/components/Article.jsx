import React from "react";
import { default as Head, Title, TwitterMeta, OpenGraphMeta } from "../components/Head";
import { format as formatDate } from "date-fns";

export { default as CodeBlock } from "./CodeBlock";
export { Link } from "react-router-dom";

export const Article = (meta) => {
    const { title, date, modifiedDate, image, type, children } = meta;
    let author = "Prasanna V. Loganathar";
    let description = meta.description ||
        "Prasanna's blog article published on " + new Date(date).toUTCString();
    return <article>
        <Title>{title}</Title>
        <TwitterMeta title={title} description={description} image={image} />
        <OpenGraphMeta title={title} description={description} image={image} url={window.location.href}
            type={type || "article"} author={author} time={date} modifiedTime={modifiedDate} />
        <header className="mb-4">
            <h1 className="title" rel="title">{title}</h1>
            <p className="d-none" rel="author">{author}</p>
            <p className="small text-muted" rel="date"><time dateTime={date}>{formatDate(new Date(date), "dddd, Do MMM YYYY")}</time></p>
        </header>
        {children}
    </article>
}

export default Article;