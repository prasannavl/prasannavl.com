import { Article, CodeBlock, Link } from "../../components/Article"; 

export const meta = {
    title: "JavaScript Notes",
    tags: ["js"],
    note: true,
    date: "2018-05-11T14:07:56.944Z",
}

export default () => {
    return <Article {...meta}>
        <h2>String: <code>slice</code>, <code>substr</code>, <code>substring</code></h2>
        <p>
            {/* Ref: https://stackoverflow.com/questions/2243824/what-is-the-difference-between-string-slice-and-string-substring */}
        </p>

        <h2>Array: <code>slice</code>, <code>splice</code></h2>
        
    </Article>
}