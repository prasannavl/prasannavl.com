import React from "react";
import formatDate from "date-fns/format";
import Layout from "./Layout";
import { Link } from "../modules/router-utils";
import Banner from "../components/Banner";
import { Title } from "../components/Head";
import Footer from "../components/Footer";
import archivesData from "../static/data/archives.json";

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

export const Archives = ({ data }) => {
    let itemsList = data.map(yearList => {
        let year = yearList[0];
        let items = yearList[1].map(article => (
            <li>
                <Link to={article.url}>{article.title}</Link>
                {article.note && <small className="text-muted"> &raquo; Note</small>}                
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

export default () => <Page data={archivesData} />;