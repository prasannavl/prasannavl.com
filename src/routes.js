import * as React from "react";
import { Route, IndexRoute, Link, NotFound } from "react-router";
import App from "./components/App";
import Expose from "./components/Expose/index";

import s2 from "./style2.scss";
import styled from "./modules/core/styled";

let Hello2 = () => (<div className="h2">Hello 2222!<div><Link to="/">Go back home</Link></div></div>);
Hello2 = styled(Hello2, s2);

let Hello3 = () => (<div>Hello 3333!<div><Link to="/">Go back home</Link></div></div>);

let routes = (
    <Route path="/" component= { App } >
        <IndexRoute component={ Expose } />
        <Route path="hello2" component= { Hello2 } />
        <Route path="hello3" component={ Hello3 } />
    </Route>);

export default routes;