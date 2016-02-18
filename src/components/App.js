import React from "react";
import executionEnvironment from "fbjs/lib/ExecutionEnvironment";

class App extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
  
  render() {
      return this.props.children;
  }
}

if (executionEnvironment.canUseDOM) {
    App.childContextTypes = {
        insertCss: React.PropTypes.func
    };

    App.prototype.getChildContext = function () {
        return { insertCss: (styles) => styles._insertCss(styles) };
    }
}

export default App;