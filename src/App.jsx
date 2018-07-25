import React, { Component, Fragment } from 'react';
import { getErrorInfo, getErrorStack } from "./modules/lang";
import appContext from './modules/app-context';
import nprogress from "nprogress";
import "./styles/index.css";
import RouterView from './components/RouterView';

class App extends Component {

  constructor(props) {
    super(props);
    this._router = appContext.router;
    this.state = {
      error: null,
    }
  }

  componentDidMount() {
    nprogress.configure({ speed: 400, });
  }

  componentDidCatch(obj, info) {
    this.setState({ error: { obj, info }});
  }

  componentWillUnmount() {
    this._router.stop();
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
    let { error } = this.state;
    return error ?
      this.renderError() :
      <RouterView router={this._router}
        onChangeStart={(ev) => { ev.state.timerId = setTimeout(() => nprogress.set(0), 0); }}
        onChangeAbort={(ev) => { clearTimeout(ev.state.timerId); }}
        onChange={(ev) => {
          setTimeout(() => nprogress.done(), 0);
          if (ev.scroll) {
            window.scroll(0, 0); ev.scroll = false;
          }
        }}
        render={(renderProps) => {
          let { isLoading, route, transition } = renderProps;
          let Component;
          if (route) {
            Component = route.component;
          }
          return Component ? <Component/> : null;
        }} />
  }
}

export default App;