import * as React from "react";

class Footer extends React.Component<any, any> {
    render() {
        // TODO: Add styles, and add appropriate links.
        // CC Link: http://creativecommons.org/licenses/by/2.5/
        const c = (
            <footer {...this.props}>Copyright &copy; {new Date(Date.now()).getUTCFullYear()} Prasanna V. Loganathar
             - Blog content licensed under the Creative Commons CC BY 2.5 |
             Unless otherwise stated or granted, code fragments licensed under Apache 2.0 License.
             | Web site built entirely from scratch, open sourced and licenced under Apache 2.0 License.</footer>
        );
        return c;
    }
}

export default Footer;