import * as React from "react";
import { Route, IndexRoute, Link, NotFound } from "react-router";
import AppContainer from "./components/AppContainer";
import Expose from "./components/Expose/index";

import s2 from "./styles/style2.scss";
import createStyled from "./modules/core/createStyled";

let Hello2 = () => (<div className="h2">Hello 2222!<div><Link to="/">Go back home</Link></div></div>);
Hello2 = createStyled(Hello2, s2);

let Hello3 = () => (<div>Hello 3333!<div><Link to="/">Go back home</Link></div></div>);

let routes = (
    <Route path="/" component= { AppContainer } >
        <IndexRoute component={ Expose } />
        <Route path="hello2" component= { Hello2 } />
        <Route path="hello3" component={ Hello3 } />
    </Route>);

export default routes;