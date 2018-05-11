import { Article, CodeBlock, Link } from "../../components/Article";

export const meta = {
    title: "Regular Expressions Reference",
    tags: ["regex"],
    note: true,
    date: "2018-05-11T12:18:56.974Z",
}

export default () => {
    return <Article {...meta}>
        
        <h2>General</h2>
        
        <h3>References</h3>
        <ul>
            <li><a href="https://medium.com/factory-mind/regex-tutorial-a-simple-cheatsheet-by-examples-649dc1c3f285">A quick cheatsheet by examples - Jonny Fox</a></li>
            <li><a href="https://www.cheatography.com/davechild/cheat-sheets/regular-expressions/">Regular Expressions Cheat Sheet - Dave Child</a></li>
            <li><a href="http://www.cbs.dtu.dk/courses/27610/regular-expressions-cheat-sheet-v2.pdf">Cheatsheet - Technical University of Denmark - with quick examples</a></li>
            <li><a href="https://gist.github.com/vitorbritto/9ff58ef998100b8f19a0">RegExp Cheat Sheet - Gist by @vitorbritto</a></li>
        </ul>
        <hr />
        
        <h2>JavaScript</h2>
        
        <h3>References</h3>
        <ul>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions">MDN - Regular Expressions Guide</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp">MDN - RegExp</a></li>
            <li><a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace">MDN - String Replace</a></li>
        </ul>
        
        <h3>Modifiers</h3>

        <li><b>Native RegExp</b>: Only as options param, inline modifiers not supported</li>
        <li><b>XRegExp</b>: Options + Inline whole expression modifier - <code>XRegExp('(?i)myregex');</code></li>
        <br />
        <table className="table table-sm table-borderless table-striped">
            <col width="50em" />
            <tbody>
                <tr>
                    <td><code>g</code></td>
                    <td>Global search.</td>
                </tr>
                <tr>
                    <td><code>i</code></td>
                    <td>Case-insensitive search.</td>
                </tr>
                <tr>
                    <td><code>m</code></td>
                    <td>Multi-line; treat beginning and end characters (^ and $) as working over multiple lines (i.e., match the beginning or end of each line (delimited by \n or \r), not only the very beginning or end of the whole input string)</td>
                </tr>
                <tr>
                    <td><code>u</code></td>
                    <td>unicode; treat a pattern as a sequence of unicode code points</td>
                </tr>
                <tr>
                    <td><code>y</code></td>
                    <td>(Lang specific) Perform a "sticky" search that matches starting at the current position in the target string.</td>
                </tr>
            </tbody>
        </table>
        
        <h3>Replacement</h3>

        <table className="table table-sm table-borderless table-striped">
            <col width="50em" />
            <tbody>
                <tr>
                    <td><code>$$</code></td>
                    <td>Inserts a "$".</td>
                </tr>
                <tr>
                    <td><code>{"$&"}</code></td>
                    <td>Inserts the matched substring.</td>
                </tr>
                <tr>
                    <td><code>$`</code></td>
                    <td>Inserts the portion of the string that precedes the matched substring.</td>
                </tr>
                <tr>
                    <td><code>$'</code></td>
                    <td>Inserts the portion of the string that follows the matched substring.</td>
                </tr>
                <tr>
                    <td><code>$n</code></td>
                    <td>Where n is a positive integer less than 100, inserts the nth parenthesized submatch string, provided the first argument was a RegExp object. Note that this is 1-indexed.</td>
                </tr>
            </tbody>
        </table>
        <hr />
        
        <h2>Bash/sed/grep</h2>
        
        <li><code>sed</code> back-references: <code>{"\\1, \\2, \\n"}</code></li>
        <li><code>-E</code> (Extended RegExp) needed for <code>+</code>, <em>grouping</em>, etc.</li>

        <hr />
        <h2>RE2 - Rust/Go/C++</h2>
        <h3>References</h3>
        <ul>
            <li><a href="https://github.com/google/re2/wiki/Syntax">RE2 Reference</a></li>
        </ul>

        <hr />
        
        <h2>.NET/C#</h2>
        
        <h3>References</h3>
        <ul>
            <li><a href="https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference">DotNet Docs Reference</a></li>
        </ul>
    </Article>
}