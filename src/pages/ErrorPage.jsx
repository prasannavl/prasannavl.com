import React from "react";
import { default as Head, Title, TwitterMeta, OpenGraphMeta } from "../components/Head";
import Layout from "../components/Layout";
import { Link } from "../modules/router-utils";

export const ErrorPage = ({ children }) => {
    return <Layout>
        <div className="d-flex justify-content-center align-items-center flex-column" style={{ height: "60vh" }}>
            {children}    
        </div>
    </Layout>;
}

export const NotFoundPage = () => {
    return <ErrorPage>
        <Title>Not Found</Title>
        <div>
            <h2>Not Found</h2>
            <p>Try going <a href="javascript: history.back()">back</a>, or explore more of <Link to="/">my blog</Link>.</p>
        </div>
    </ErrorPage>;
}

export const OfflinePage = () => {
    return <ErrorPage>
        <div>
            <h2>Network Offline</h2>
            <p>There seems to be a problem with your network connection.<br/>Try refreshing the page to see if it helps.</p>
        </div>
    </ErrorPage>;
}