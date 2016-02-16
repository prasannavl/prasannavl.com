import React from "react";
import { Router, Route } from "react-router";
import history from "./modules/core/history";
import Hello from "./Hello";

let Hello2 = () => (<div>Hello there from Static Markup 2222!</div>);
let Hello3 = () => (<div>Hello there from Static Markup 3333!</div>);

let routes = (
    <Router history={history}>
    <Route path="/" component= { Hello } />
        <Route path="/hello2" component={Hello2} />
        <Route path="/hello3" component={Hello3} />
    </Router>);

export default routes;