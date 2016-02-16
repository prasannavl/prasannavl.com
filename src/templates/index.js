import React, { PropTypes } from "react";

function Html({ head, body }) {
    let headComponent = head ? (<head dangerouslySetInnerHTML = {{ __html: head }}></head>) : null;
    const html = (
        <html lang="en">
        {headComponent}
        <body>
            <div id="outlet" dangerouslySetInnerHTML= {{ __html: body }} />
        </body>
        </html>
        );
        
    return html;
}

Html.propTypes = {
    htmlConfig: PropTypes.object,    
};

export default Html;