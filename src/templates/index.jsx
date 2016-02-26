import * as React from "react";

function Html(options) {
    const { title, description, css, js, content, inlineCss, inlineScripts } = options;
    const isArray = Array.isArray;

    const html = (
        <html lang="en">
            <head>
                <meta charSet="utf-8"/>
                <meta httpEquiv="X-UA-Compatible" content= "IE=edge" />
                <title>{title}</title>
                <meta name="description" content={description} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="favicon.ico" />
                <meta name="msapplication-TileColor" content="" />
                <meta name="msapplication-TileImage" content="" />
                <link rel="apple-touch-icon-precomposed" href="" />
                {isArray(js) ? js.map(x => <script src={x} defer></script>) : null}                
                {isArray(css) ? css.map(x => <link rel="stylesheet" href={x} />) : null}
                {isArray(inlineCss) ? inlineCss.map(x => <style type="text/css" {...(x.attributes)} dangerouslySetInnerHTML={{ __html: x.content }}></style>) : null}
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