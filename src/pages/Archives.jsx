import React from "react";
import { format as formatDate } from "date-fns";
import Layout from "./Layout";
import { Link } from "react-router-dom";
import loadable from "loadable-components";
import Banner from "../components/Banner";
import { Title } from "../components/Head";
import Footer from "../components/Footer";

export const Page = (props) => (
    <Layout>
        <Title>Archives</Title>
        <Banner />
        <main role="main">
            <Archives {...props} />
        </main>
        <Footer />
    </Layout>
);

const PageContainer = loadable(async () => {
    let data = await import("../static/data/archives.json");
    return () => <Page data={data} />;
});

export const Archives = ({ data }) => {
    let itemsList = data.map(yearList => {
        let year = yearList[0];
        let items = yearList[1].map(article => (
            <li>
                <Link to={article.url}>{article.title}</Link>
                &nbsp;&rsaquo;&nbsp;
                <small className="no-wrap"><time dateTime={article.date}>{formatDate(new Date(article.date), "Do MMM YYYY")}</time></small>
            </li>
        ));

        let list;
        if (items.length > 0) {
            list = <ul className="list-unordered">{items}</ul>;
        }
        if (!list) {
            return <h4>Nothing to see here.</h4>
        }
        return <section><h4>{year}</h4>{list}</section>;
    });

    return <React.Fragment>
        <h2>Archives</h2>
        {itemsList}
    </React.Fragment>
};

export default PageContainer;