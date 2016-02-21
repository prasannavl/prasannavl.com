import * as React from "react";
import { PropTypes } from "react";

interface AppProps extends React.Props<App> {
    applyCss: (styles: CssModule) => void;
}

interface AppContext {
    applyCss: (styles: CssModule) => void;
}

class App extends React.Component<AppProps, any> implements React.ChildContextProvider<AppContext> {

    static childContextTypes = {
        applyCss: PropTypes.func.isRequired
    };

    constructor(props : AppProps) {
        super(props);
        this.state = {};
    }

    getChildContext() {
        return { applyCss: this.props.applyCss };
    }

    render() {
        return this.props.children as JSX.Element;
    }
}


export default App;