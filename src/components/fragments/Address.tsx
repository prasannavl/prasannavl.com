import React from "react";
import ReactDOM from "react-dom";

class Address extends React.Component<any, any> {
    render() {
        //const emailAddress = "&#112;&#118;&#108;&#064;&#112;&#114;&#097;&#115;&#097;&#110;&#110;&#097;&#118;&#108;&#046;&#099;&#111;&#109;";
        const emailAddress = "pvl@prasannavl.com";
        const mailToAddress = "mailto:Prasanna V. Loganathar <" + emailAddress + ">";
        const c = (
            <address className="icons">
                <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                <a href={mailToAddress} className="icon-envelope"></a>
            </address>
        );
        return c;
    }
}

export default Address;