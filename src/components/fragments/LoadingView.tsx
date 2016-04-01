import React from "react";
import createStyled from "../../modules/core/createStyled";

let style = require("./LoadingView.scss") as any;

export class LoadingView extends React.Component<any, any> {
    render() {
        let pathStrokeMotionColor = "#3f5660";
        let pathStrokeStationaryColor = "#000";
        let stationaryPathOpacity = "0.1";

        let infinity = (<svg width="300px" height="200px" viewBox="0 0 187.3 93.7" preserveAspectRatio="xMidYMid meet" className="container">
            <path stroke={pathStrokeMotionColor} id="infinity-loader-outline" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
            <path id="outline-bg" fill="none" opacity={stationaryPathOpacity} stroke={pathStrokeStationaryColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1 c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
        </svg>);

        return <div className={style.root}>{infinity}</div>;
    }
}

export default createStyled(LoadingView, style);