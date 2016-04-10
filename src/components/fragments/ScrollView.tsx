import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import GeminiScrollbar from "gemini-scrollbar";

export interface ScrollViewProps extends React.Props<any> {
    autoshow?: boolean;
    forceCustom?: boolean;
}

export class ScrollView extends React.Component<ScrollViewProps, any> {
    scrollbar: any;

    componentDidMount() {
        this.scrollbar = new GeminiScrollbar({
            element: ReactDOM.findDOMNode(this),
            autoshow: this.props.autoshow,
            forceGemini: this.props.forceCustom,
            createElements: false
        }).create();
    }

    componentDidUpdate() {
        this.scrollbar.update();
    }

    componentWillUnmount() {
        this.scrollbar.destroy();
        this.scrollbar = null;
    }

    render() {
        let { children } = this.props;
        let others = _.omit(this.props, "children");

        return (
            <div {...others}>
                <div className="gm-scrollbar -vertical">
                    <div className="thumb"></div>
                </div>
                <div className="gm-scrollbar -horizontal">
                    <div className="thumb"></div>
                </div>
                <div className="gm-scroll-view">
                    {children}
                </div>
            </div>
        );
    }
}