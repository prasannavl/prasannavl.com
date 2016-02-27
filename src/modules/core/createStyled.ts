import * as React from "react";
import Base from "../../components/Base";

function getDisplayName(component: any) {
    let name = component.displayName || "Component";
    return `Styled(${name})`;
}

export default function createStyled<T>(InnerComponent:T, ...styles:any[]) {
    class StyleComponent extends Base<any, any> {
        static displayName = getDisplayName(InnerComponent);
        private removeCss: () => void;

        componentWillMount() {
            const applyCss = this.context.applyCss;
            if (applyCss)
                this.removeCss = applyCss.apply(null, styles);
        }

        componentWillUnmount() {
            const removeCss = this.removeCss;
            if (removeCss)
                setTimeout(removeCss, 0);
        }

        render() {
            return React.createElement(InnerComponent as any, this.props);
        }
    }
    return StyleComponent as any as T;
}
