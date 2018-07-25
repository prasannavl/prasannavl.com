import React, { Component } from 'react';
import nprogress from "nprogress";
import RouterView from './components/RouterView';
import { Router, getCurrentPath } from './modules/util/router';
import resolver from './routes';
import env from "./modules/shared/env";
import ErrorPanel from "./components/ErrorPanel";

import "./styles/index.css";

class App extends Component {

  constructor(props) {
    super(props);
    this._router = new Router(resolver);
    this.state = {
      error: null,
    }
  }

  componentDidMount() {
    nprogress.configure({ speed: 400, });
    this._router.go(getCurrentPath(), { replace: true });
  }

  componentDidCatch(obj, info) {
    this.setState({ error: { obj, info } });
  }

  componentWillUnmount() {
    this._router.stop();
  }

  renderError() {
    let err = this.state.error;
    return <ErrorPanel {...err} devMode={env.devMode} />;
  }

  renderRouter() {
    return <RouterView router={this._router}
      onChangeStart={(ev) => { ev.state.timerId = setTimeout(() => nprogress.set(0), 0) }}
      onChangeAbort={(ev) => { clearTimeout(ev.state.timerId) }}
      onChange={(ev) => { setTimeout(() => nprogress.done(), 0) }} />;
  }

  render() {
    let { error } = this.state;
    return error ?
      this.renderError() : this.renderRouter();
  }

}

export default App;