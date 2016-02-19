import React, { PropTypes } from "react";

class App extends React.Component {
    static propTypes = {
        applyCss: PropTypes.func.isRequired
    };

    static childContextTypes = {
        applyCss: PropTypes.func.isRequired
    };

    constructor() {
        super();
        this.state = {};
    }

    getChildContext() {
        return { applyCss: this.props.applyCss };
    }

    render() {
        return this.props.children;
    }
}


export default App;