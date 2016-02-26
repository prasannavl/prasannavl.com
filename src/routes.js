import * as React from "react";
import { Route, IndexRoute, Link, NotFound } from "react-router";
import AppContainer from "./components/AppContainer";
import Expose from "./components/Expose/index";


let routes = (
    <Route path="/" component= { AppContainer } >
        <IndexRoute component={ Expose } />
    </Route>);

export default routes;