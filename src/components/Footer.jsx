import React from "react";
import ReactDOM from "react-dom";
import { Link, withRouter } from "react-router-dom";

const Footer = ({ showTwitter }) => {
    const scrollToTopJs = "javascript:window.scroll(0,0)";
    const scrollToBottomJs = "javascript:window.scroll(0,document.body.scrollHeight)";

    const c = (
        <footer className="mt-4"><hr />{showTwitter && (<React.Fragment><TwitterNoteWithRoute /><hr /></React.Fragment>)}
            <nav className="clearfix footer-nav">
                <ul className="list-inline float-left">
                    <li className="list-inline-item"><a href={scrollToTopJs}>Top</a></li>
                    <li className="list-inline-item"><Link to="/">Home</Link></li>
                    <li className="list-inline-item"><Link to="/archives/">Archives</Link></li>
                </ul>
            </nav>
            <p className="small text-muted mt-1 mb-0">
                <strong>Copyright &copy; {new Date(Date.now()).getUTCFullYear()} <a href="/">Prasanna V. Loganathar</a></strong>. Blog content, design elements or any information without a direct or indirect license is licensed under <a href="https://creativecommons.org/licenses/by/4.0/" rel="license">Creative Commons CC BY 4.0</a>. Similarly, any such code fragments are licensed under <a rel="license" href="http://www.apache.org/licenses/LICENSE-2.0">Apache 2.0 License</a>.</p></footer>
    );
    return c;
}

const TwitterNote = ({ location }) => {
    return <aside className="my-3"><p><a href="https://www.twitter.com/prasannavl">@prasannavl</a> - If you enjoyed this post, please <a href={"https://twitter.com/intent/tweet?url=https://www.prasannavl.com" + location.pathname} target="_blank">share it with your followers</a>.</p></aside>
}

const TwitterNoteWithRoute = withRouter(TwitterNote);

export default Footer;