import * as React from "react";

function getDisplayName(component: any) {
    let name = component.displayName || "Component";
    return `Styled(${name})`;
}

export default function createStyled<T>(InnerComponent: T, ...styles: any[]) {
    class StyleComponent extends React.Component<any, any> {
        static displayName = getDisplayName(InnerComponent);

        static contextTypes: any = {
            applyCss: React.PropTypes.func,
        };

        private removeCss: () => void;

        componentWillMount() {
            const applyCss = (this.context as any).applyCss;
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
