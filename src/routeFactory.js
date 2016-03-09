import * as React from "react";
import { Locations, Location } from "react-router-component";
import AppContainer from "./components/AppContainer";
import MainView from "./components/MainView/index";

let routeFactory = (props) => (
    <Locations component={ AppContainer } {...props}>
        <Location path="*" handler={ MainView } />
    </Locations>);

export default routeFactory;