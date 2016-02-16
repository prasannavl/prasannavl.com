import React from "react";
import { Router, Route, IndexRoute } from "react-router";
import history from "./modules/core/history";
import App from "./components/App";
import Expose from "./components/Expose";

let Hello2 = () => (<div>Hello 2222!</div>);
let Hello3 = () => (<div>Hello 3333!</div>);

let routes = (
    <Router history={history}>
    <Route path="/" component= { App } >
        <IndexRoute component={ Expose } />
        <Route path="hello2" component= { Hello2 } />
        <Route path="hello3" component={Hello3} />
    </Route>
    </Router>);

export default routes;