import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import Head from './components/Head';
import { getErrorInfo, getErrorStack } from "./modules/lang";
import { Router } from "./Router";
import appContext from './modules/app-context';
import nprogress from "nprogress";
import "./styles/index.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      errorInfo: null,
      InnerComponent: null,
    };
    this.router = new Router();
    this.ephemeralState = {
      scroll: false,
      lastPopId: null,
    }
    this.popState();
  }

  componentDidMount() {
    nprogress.configure({ speed: 400, });
    this.router.startListen(this.popState.bind(this));
    this.scrollIfNeeded();
  }

  scrollIfNeeded() {
    if (this.ephemeralState.scroll) {
      window.scroll(0, 0);
      this.ephemeralState.scroll = false;
    }
  }

  componentDidUpdate() {
    this.scrollIfNeeded();
  }

  componentWillUnmount() {
    this.router.stopListen();
  }

  componentDidCatch(obj, info) {
    this.setState({ error: { obj, info }});
  }

  popState(ev) {
    let scroll = false;
    if (ev && ev.state && ev.state.scroll) {
      scroll = true;
    }
    if (this.ephemeralState.lastPopId !== null) {
      nprogress.set(0);
    } else {
      setTimeout(() => {
        if (this.ephemeralState.lastPopId !== null) {
          nprogress.start();
        }
      }, 0);
    }
    let popId = this.ephemeralState.lastPopId = Math.random();
    this.router.resolveComponent()
      .then(x => {
        if (popId === this.ephemeralState.lastPopId) {
          this.ephemeralState.scroll = scroll;
          this.ephemeralState.lastPopId = null;
          this.setState({ InnerComponent: x });
          nprogress.done();
        }
      }).catch(err => {
        this.setState({ error: { obj: "Can't resolve route", info: err } });
        nprogress.done();
      });
  }

  renderError() {
    let { obj, info } = this.state.error;
    let devMode = appContext.envHelper.devMode;
    return <div className="vc-container app-error">
      <div>
        <h1>Something went wrong.</h1>
        {devMode ?
          <div>
            {getErrorInfo(obj)}<br/>
            <br />
            {getErrorStack(obj).map((x, i) => <Fragment key={i}>{x}<br /></Fragment>)}
            <br />
            {getErrorStack(info).map((x, i) => <Fragment key={i}>{x}<br /></Fragment>)}
          </div>
          : <p>Try restarting the app to see if it helps.</p>
        }
      </div>
    </div>;
  }

  render() {
    let { error, InnerComponent } = this.state;
    return error ?
      this.renderError() :
      InnerComponent && <InnerComponent />;
  }
}

export default App;