import * as React from "react";
import { Locations, Location } from "react-router-component";
import AppContainer from "./components/AppContainer";
import Expose from "./components/Expose/index";
import MainView from "./components/MainView/index";

let routeFactory = (props) => (
    <Locations component={ AppContainer } {...props}>
        <Location path="/" handler={ Expose } />
        <Location path="/*" handler={ MainView } />
    </Locations>);

export default routeFactory;