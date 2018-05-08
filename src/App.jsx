import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import Head from './components/Head';
import Home from "./pages/Home";
import Archives from "./pages/Archives";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";
import appContext from './modules/app-context';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
  }

  renderError() {
    let { error, errorInfo } = this.state;
    let devMode = appContext.envHelper.devMode;
    return ReactDOM.createPortal(<div className="vc-container app-error">
      <div>
        <h1>Something went wrong.</h1>
        {devMode ?
          <div>Error:<br />
            {JSON.stringify(errorInfo).split("\\n").map(x => <Fragment>{x}<br /></Fragment>)}
          </div>
          : <p>Try refreshing the page to see if it helps.</p>
        }
      </div>
    </div>, document.querySelector("body"));
  }

  renderRoutes() {
    return <Fragment>
      <Head />
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/archives" component={Archives} />
          <Route path="/:post*" component={Post} />
        </Switch>
      </Router>
    </Fragment>;
  }

  render() {
    let { error } = this.state;
    return error ?
      this.renderError() :
      this.renderRoutes();
  }
}

export default App;