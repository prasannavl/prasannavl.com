import React from "react";

class Footer extends React.Component<any, any> {
    render() {
        const c = (
            <footer {...this.props}><strong>Copyright &copy; {new Date(Date.now()).getUTCFullYear()} Prasanna V. Loganathar</strong> - 
            Blog content, and web site design are licensed under the <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">Creative Commons CC BY 4.0</a> | Unless otherwise stated or granted, any code fragments including the website source components are licensed under the <a href="http://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache 2.0 License</a>.</footer>
        );
        return c;
    }
}

export default Footer;