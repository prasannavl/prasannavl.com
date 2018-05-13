import React from "react";
import Layout from "../components/Layout";
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
