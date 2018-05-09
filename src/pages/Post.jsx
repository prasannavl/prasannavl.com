import React from "react";
import Layout from "./Layout";
import NotFound from "./NotFound";
import { Link } from "../modules/router-utils";
import Helmet from "react-helmet";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const Page = (props) => {
    let { component, ...ownProps } = props;
    let Component = component;
    return <Layout>
        <Banner />
        <main role="main">
            <Component {...ownProps} />
        </main>
        <Footer showTwitter/>
    </Layout>;
}

export default Page;
