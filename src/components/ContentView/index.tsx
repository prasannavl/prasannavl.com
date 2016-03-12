import * as React from "react";
import Sidebar from "../Sidebar/index";
import createStyled from "../../modules/core/createStyled";
import LoremSegment from "../fragments/Lorem";

let style = require("./style.scss") as any;

class LoremContent extends React.Component<any, any> {
     render() {
        const c = (
            <div className={style.root} {...this.props}>
                <LoremSegment count={3} />
            </div>
        );
        return c;
    }
}

// class ContentView extends React.Component<any, any> {
//     render() {
//         const locations = (
//             <Locations contextual component={null}>
//                 <Location path="/*" handler={ LoremContent } />
//             </Locations>);
//         return locations;
//     }
// }

export default createStyled(LoremContent, style);