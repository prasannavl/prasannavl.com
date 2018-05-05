import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import Head from './components/Head';
import Home from "./pages/Home";
import Archives from "./pages/Archives";
import Post from "./pages/Post";
import NotFound from "./pages/NotFound";

export default (props) => {
  return <Fragment>
    <Head />
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/archives" component={Archives} />
        <Route path="/:post*" component={Post} />
      </Switch>
    </Router>
  </Fragment>
}