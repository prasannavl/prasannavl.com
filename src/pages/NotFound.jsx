import React from "react";
import { default as Head, Title, TwitterMeta, OpenGraphMeta } from "../components/Head";
import Layout from "./Layout";
import { Link } from "../modules/router-utils";

const NotFound = () => {
    return <Layout>
        <Title>Not Found</Title>
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "60vh" }}>
            <h2>404 <span style={{ fontWeight: "100", color: "#aaa" }}>&#8739;</span> Not Found</h2>
            <div>Try going <a href="javascript: history.back()">back</a>, or explore more of <Link to="/">blog</Link>.</div></div>
    </Layout>;
}

export default NotFound;