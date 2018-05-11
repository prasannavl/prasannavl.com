import React, { Component, Fragment } from 'react';
import ReactDOM from "react-dom";
import Head from './components/Head';
import { Router } from "./Router";
import appContext from './modules/app-context';
import nprogress from "nprogress";

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
        this.setState({ error: "can't resolve route", errorInfo: err });
        nprogress.done();
      });
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

  render() {
    let { error, InnerComponent } = this.state;
    return error ?
      this.renderError() :
      InnerComponent && <InnerComponent/>;
  }
}

export default App;