import React, { Component, PropTypes } from "react";

function styled(InnerComponent, ...styles) {
    
    function getDisplayName() {
        let name = InnerComponent.displayName || InnerComponent.name || "Component";
        return `Styled(${name})`;
    }
    
    return class StyleWrapper extends Component {
        static displayName = getDisplayName();
        static InnerComponent = InnerComponent;
        
        static contextTypes = {
            applyCss: PropTypes.func.isRequired,
        };
        
        componentWillMount() {
            this.removeCss = this.context.applyCss.apply(null, styles);
        }

        componentWillUnmount() {
            setTimeout(this.removeCss, 0);
        }

        render() {
            return React.createElement(InnerComponent, this.props);
        }
    };
}

export default styled;
