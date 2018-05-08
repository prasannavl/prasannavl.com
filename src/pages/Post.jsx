import React from "react";
import Layout from "./Layout";
import NotFound from "./NotFound";
import { Link } from "react-router-dom";
import loadable from "loadable-components";
import Helmet from "react-helmet";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const Page = (props) => {
    let { Component, ...ownProps } = props;  
    return <Layout>
        <Banner />
        <main role="main">
            <Component {...ownProps} />
        </main>
        <Footer showTwitter/>
    </Layout>;
}

const PageContainer = ({ match }) => {
    let dataPath;
    if (match.params) {
        dataPath = match.params.post;
    }
    if (!dataPath) {
        return <NotFound/>;
    }
    let Comp = loadable(async () => {
        let data;
        try {
            data = await import("../posts/" + dataPath);
        } catch (err) {
            // TODO: Verify error message to contain "Cannot find module" string
            // for 404. Else handle it appropriately.
            return () => <NotFound/>;
        }
        return () => <Page Component={data.default} />;
    });
    return <Comp/>;
}

export default PageContainer;
