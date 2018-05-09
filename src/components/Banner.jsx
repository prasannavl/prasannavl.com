import React from "react";
import { Link } from "../modules/router-utils";

const Banner = ({ index }) => {
    let text = "Prasanna V. Loganathar";
    return (
        <header className="banner">
            <h1 id="top"><Link to="/">{text}</Link></h1>
            {/* {<h1 id="top">{text}</h1>} */}
            {index || <Subtitle />}
            <hr />
        </header>);
};

const Subtitle = () => {
    return (
        <React.Fragment>
            <p>Explore more of <Link to="/">my blog</Link>, <Link to="/archives/">archives</Link> or subscribe to my <a rel="alternate" type="application/rss+xml" href="/rss.xml">feed</a>.</p>
        </React.Fragment>
    );
}

export default Banner;