import React from "react";

function Html(options) {
    const { title, description, css, js, content, inlineCss, inlineScripts, canonical } = options;
    const isArray = Array.isArray;

    const html = (
        <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <title>{title}</title>
                <meta name="description" content={description} />
                {canonical ? <link rel="canonical" href={canonical} /> : null }
                <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png"/>
                <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png"/>
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png"/>
                <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png"/>
                <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png"/>
                <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png"/>
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png"/>
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png"/>
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png"/>
                <link rel="icon" type="image/png" href="/icons/favicon-32x32.png" sizes="32x32"/>
                <link rel="icon" type="image/png" href="/icons/favicon-96x96.png" sizes="96x96"/>
                <link rel="icon" type="image/png" href="/icons/favicon-16x16.png" sizes="16x16"/>
                <link rel="manifest" href="/icons/manifest.json"/>
                <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#0096d6"/>
                <link rel="shortcut icon" type="image/x-icon" href={"/favicon.ico?" + Date.now()}/>
                <meta name="msapplication-TileColor" content="#0096d6"/>
                <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png"/>
                <meta name="msapplication-config" content="/icons/browserconfig.xml"/>
                <meta name="theme-color" content="#0096d6"/>
                {isArray(css) ? css.map(x => <link rel="stylesheet" href={x} />) : null}
                {isArray(js) ? js.map(x => <script src={x} defer></script>) : null}
                {isArray(inlineCss) ? inlineCss.map(x => <style type="text/css" {...(x.attributes)} dangerouslySetInnerHTML={{ __html: x.content }}></style>) : null}
                <script src='https://www.google-analytics.com/analytics.js' defer></script>
            </head>
            <body>
                {isArray(inlineScripts) ? inlineScripts.map(x => <script dangerouslySetInnerHTML={{ __html: x.content }}></script>) : null}
                <div id="outlet" dangerouslySetInnerHTML= {{ __html: content }}></div>
            </body>
        </html>
    );

    return html;
}

Html.propTypes = {
    htmlConfig: React.PropTypes.object,
};

export default Html;