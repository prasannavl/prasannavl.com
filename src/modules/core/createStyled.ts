import React from "react";
import { IAppContext } from "./AppContext";

function getDisplayName(component: any) {
    let name = component.displayName || component.name || "Component";
    return `Styled(${name})`;
}

function getCssApplier(context: IAppContext) {
    return context.services.applyCss;
}

export default function createStyled<T>(InnerComponent: T, ...styles: any[]) {
    class StyledComponent extends React.Component<any, any> {
        static displayName = getDisplayName(InnerComponent);

        static contextTypes: any = {
            services: React.PropTypes.any,
        };

        private removeCss: () => void;

        componentWillMount() {
            const applyCss = getCssApplier(this.context as IAppContext);
            this.removeCss = applyCss.apply(null, styles);
        }

        componentWillUnmount() {
            const removeCss = this.removeCss;
            setTimeout(removeCss, 0);
        }

        render() {
            return React.createElement(InnerComponent as any, this.props);
        }
    }
    // Trick the type system into thinking its the same component
    return StyledComponent as any as T;
}