import * as React from "react";
import { Route, IndexRoute, Link, NotFound } from "react-router";
import App from "./components/App";
import Expose from "./components/Expose/index";

let Hello3 = () => (<div>Hello 3333!<div><Link to="/">Go back home</Link></div></div>);

let routes = (
    <Route path="/" component= { App } >
        <IndexRoute component={ Expose } />
        <Route path="hello3" component={ Hello3 } />
    </Route>);

export default routes;