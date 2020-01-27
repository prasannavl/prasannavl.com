import React, { Fragment } from "react";
import Helmet from "react-helmet";

export const defaultTitle = "Prasanna Loganathar";
export const defaultDescription = "Prasanna Loganathar's Weblog";
export const defaultImage = "https://www.prasannavl.com//icons/mstile-310x310.png";
export const twitterHandle = "@prasannavl";

const Head = (props) => {
  let { description, image, ogType, url } = props;
  return (
      <Helmet titleTemplate={"%s | " + defaultTitle} defaultTitle={defaultTitle}>
      <meta name="description" content={description || defaultDescription} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {url && <link rel="canonical" href={url} />}
      {/* Favicon */}
      <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="/icons/favicon-16x16.png" sizes="16x16" />
      <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      {/* Apple Items */}
      <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png" />
      <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#0096d6" />
      {/* Android Items */}
      <link rel="manifest" href="/manifest.json" />
      {/* Microsoft Items */}
      <meta name="msapplication-TileColor" content="#0096d6" />
      <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      {/* RSS */}
      <link rel="alternate" type="application/rss+xml" href="https://www.prasannavl.com/rss.xml" />
      {/* Sitemap */}
      <link rel="sitemap" href="https://www.prasannavl.com/sitemap.xml" />
    </Helmet>
  );
}

export const Title = ({ children }) => {
  return <Helmet><title>{children}</title></Helmet>
}

export const OpenGraphMeta = ({ title, description, image, type, url, author, time, modifiedTime, direct }) => {
  let Wrapper = direct ? Fragment : Helmet;
  return <Wrapper>
    <meta property="og:title" content={title || defaultTitle} />
    <meta property="og:site_name" content={defaultTitle} />    
    <meta property="og:type" content={type || "website"} />
    <meta property="og:description" content={description || defaultDescription} />
    <meta property="og:image" content={image || defaultImage} />
    {url && <meta property="og:url" content={url} />}
    {author && <meta property="og:article:author" content={author} />}  
    {time && <meta property="og:article:article:published_time" content={time} />}  
    {modifiedTime && <meta property="og:article:article:modified_time" content={modifiedTime} />}  
  </Wrapper>;
}

export const TwitterMeta = ({ title, description, image, direct }) => {
  let Wrapper = direct ? Fragment : Helmet;
  return <Wrapper>
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content={twitterHandle} />
    <meta name="twitter:creator" content={twitterHandle} />      
    <meta name="twitter:title" content={title || defaultTitle} />
    <meta name="twitter:description" content={description || defaultDescription} />
    {image && <meta name="twitter:image" content={image} />}
  </Wrapper>
}

export default Head;
