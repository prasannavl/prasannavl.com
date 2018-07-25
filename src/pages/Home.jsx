import React from "react";
import Layout from "../components/Layout";
import formatDate from "date-fns/format";
import Link from "../components/Link";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

import featuredData from "../data/featured.json";
import recentData from "../data/recent.json";
import projectsData from "../data/projects.json";

export const Page = (props) => (
  <Layout>
    <Banner index />
    <Intro />
    <hr />
    <main role="main">
      <Articles {...props.indexes} />
      <hr />
      <Projects data={props.projects} />
    </main>
    <Footer />
  </Layout>
);

export const Intro = () => {
  const encodedEmailAddress = "&#x70;&#x76;&#x6c;&#x40;&#x70;&#x72;&#x61;&#x73;&#x61;&#x6e;&#x6e;&#x61;&#x76;&#x6c;&#x2e;&#x63;&#x6f;&#x6d;";
  const mailToHref = `mailto:${encodedEmailAddress}`;
  return <React.Fragment>
    <p className="mb-md-0">A 20-something <a href="https://xkcd.com/242/" target="_blank">science-geek</a>, <a href="https://xkcd.com/387/" target="_blank">technology architect</a> and <a href="https://www.forbes.com/sites/kateharrison/2013/03/05/cartoon-truths-for-entrepreneurs/#286e22733af4" target="_blank">entrepreneur</a>.</p>
    <address> Follow me on Twitter <a href="https://www.twitter.com/prasannavl">@prasannavl</a> or reach me by email at <a href={mailToHref} dangerouslySetInnerHTML={{ __html: encodedEmailAddress }} />.
    </address>
    <p>You may also subscribe to my <a rel="alternate" type="application/rss+xml" href="/rss.xml">feed</a>, or find me on GitHub <a href="https://www.github.com/prasannavl">@prasannavl</a>.</p>
  </React.Fragment>
};

export const Articles = ({ featured, recent }) => {
  let itemsList = [recent, featured].map(val => {
    let items = val.map(x => (
      <li key={x.url}>
        <Link to={x.url}>
          {x.title}
        </Link>
        {x.note && <small className="text-muted"> &raquo; Note</small>}
        &nbsp;&rsaquo;&nbsp;
        <small className="no-wrap"><time dateTime={x.date}>{formatDate(new Date(x.date), "Do MMM YYYY")}</time></small>
      </li>
    ));

    let list;
    if (items.length > 0) {
      list = <ul className="list-unordered">{items}</ul>;
    }
    return list;
  });

  return <section>
    <h2>Articles <small className="h-small">&raquo;&nbsp;<Link to="/archives/">show all</Link></small></h2>
    <section>
      <h4>Recent</h4>
      {itemsList[0]}
    </section>
    <section>
      <h4>Featured</h4>
      {itemsList[1]}
    </section>    <section>
      <h4>Archive</h4>
      <p>See <Link to="/archives/">the complete list</Link> of my articles.</p>
    </section>
  </section>
}

export const Projects = ({ data }) => {
  return <section>
    <h2>Projects</h2>
    <section>
      <h4>Current</h4>
      <p>I'm currently not promoting any of my projects at this time.</p>
    </section>
    <section>
      <h4>Most Popular <small className="h-small">&nbsp;(OSS)</small></h4>
      <table className="table table-sm table-borderless">
        <tbody>
          {data.map(x => <tr key={x.url}>
              <th><a href={x.url}>{x.name}</a></th>
              <td>{x.description}</td>
            </tr>)}
        </tbody>
      </table>
    </section>
    <section>
      <h4>Archive</h4>
      <p>Complete listing of all my open source projects can be found on <a href="https://www.github.com/prasannavl">GitHub (prasannavl)</a>.</p>
    </section>
  </section>
}

export default () => {
  let indexes = { featured: featuredData, recent: recentData };
  return <Page indexes={indexes} projects={projectsData} />;
};