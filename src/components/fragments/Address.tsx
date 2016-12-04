import React from "react";
import ReactDOM from "react-dom";

class Address extends React.Component<any, any> {
    render() {
        const encodedEmailAddress = "&#x70;&#x76;&#x6c;&#x40;&#x70;&#x72;&#x61;&#x73;&#x61;&#x6e;&#x6e;&#x61;&#x76;&#x6c;&#x2e;&#x63;&#x6f;&#x6d;";
        const mailToHref = `mailto:${encodedEmailAddress}`;
        const str = `
                <a href="https://www.twitter.com/prasannavl" class="icon-twitter" target="_blank"></a>
                <a href="https://www.github.com/prasannavl" class="icon-mark-github" target="_blank"></a>
                <a href="https://www.facebook.com/prasannavl" class="icon-facebook-square" target="_blank"></a>
                <a class="icon-envelope" href="${mailToHref}"></a>
                `;
        return (<address className="icons" dangerouslySetInnerHTML={{ __html: str}}></address>);
    }

/**
    // If React can someday handle raw attribute value, use this below:
    render() {
        const encodedEmailAddress = "&#x70;&#x76;&#x6c;&#x40;&#x70;&#x72;&#x61;&#x73;&#x61;&#x6e;&#x6e;&#x61;&#x76;&#x6c;&#x2e;&#x63;&#x6f;&#x6d;";
        const mailToHref = `mailto:${encodedEmailAddress}`;
        const c = (
            <address className="icons">
                <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                <a href={mailToHref} className="icon-envelope"></a>
            </address>
        );
        return c;
    }
**/
}

export default Address;