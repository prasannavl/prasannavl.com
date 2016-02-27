import * as React from "react";

class View {
    static getLink(text: string, linkSrc: string, classNames: string, target?: string | boolean) {
        let targetAttrVal : string;
        if (target !== undefined && target !== null) {
            if (typeof (target) == "boolean") { targetAttrVal = target ? "_blank" : null }
            else { targetAttrVal = target as string; }
        }

        let attrs : any;
        if (targetAttrVal) { attrs = { target: targetAttrVal } };        
        
        return (<a href={ linkSrc } className={ classNames } {...attrs}>{text}</a>);
    }
}

export default View;