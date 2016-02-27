import * as React from "react";
import View from "../../modules/View";

class Address extends React.Component<any, any> {

    constructor() {
        super();
    }

    render() {
        const c = (
            <address className="icons">
                { View.getLink(null,"https://www.twitter.com/prasannavl", "icon-twitter", true) }
                { View.getLink(null,"https://www.github.com/prasannavl", "icon-mark-github", true) }
                { View.getLink(null, "https://www.facebook.com/prasannavl", "icon-facebook-square", true) }
                { View.getLink(null, "mailto:Prasanna V. Loganathar <pvl@prasannavl.com>", "icon-envelope") }
            </address>
        );
        return c;        
    }
}

export default Address;