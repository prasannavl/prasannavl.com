import * as React from "react";
import { Route, IndexRoute } from "react-router";
import AppContainer from "./components/AppContainer";
import Expose from "./components/Expose/index";
import MainView from "./components/MainView/index";

let routes = (
    <Route path="/" component={ AppContainer } >
        <IndexRoute component={ Expose } />
        <Route path="*" component={ MainView } />
    </Route>);

export default routes;