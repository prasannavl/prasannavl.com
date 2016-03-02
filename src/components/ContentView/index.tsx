import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";

let style = require("./style.scss") as any;

class ContentView extends React.Component<any, any> {
    render() {
        const textStyle = { "alignmentBaseline": "central", "textAnchor": "middle", "fill": "white", "fontWeight": "700", "fontFamily": "Roboto"};
            
        const c = (
            <div className={style.root} {...this.props}>
                <LoremSegment count={1} />
                <svg width="200" height="200" style={{ border: "1px solid yellow"}}>
                    <circle cx="100" cy="100" r="100" fill="limegreen"/>
                    <circle cx="100" cy="100" r="4" fill="black" />
                    <line x1="100" y1="0" x2="100" y2="200" stroke="blue"/>
                    <line x1="0" y1="100" x2="200" y2="100" stroke="blue"/>
                    <text x="100" y="100" style={textStyle} fontSize="192">P</text>
                </svg>
            </div>
        );
        return c;
    }
}

export default createStyled(ContentView, style);