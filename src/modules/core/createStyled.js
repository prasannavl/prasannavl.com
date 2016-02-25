import React, { Component, PropTypes } from "react";

function getDisplayName(component) {
    let name = component.displayName || "Component";
    return `Styled(${name})`;
}

export default function createStyled(InnerComponent, ...styles) {
    class StyleComponent extends Component {
        static displayName = getDisplayName(InnerComponent);

        static contextTypes = {
            applyCss: PropTypes.func.isRequired,
        };

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
            return React.createElement(InnerComponent, this.props);
        }
    }
    return StyleComponent;
}
