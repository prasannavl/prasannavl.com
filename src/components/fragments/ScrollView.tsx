import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import GeminiScrollbar from "gemini-scrollbar";
import { StringUtils } from "../../modules/utils/CoreUtils";

export interface ScrollViewProps extends React.HTMLProps<React.HTMLAttributes> {
    autoshow?: boolean;
    forceCustom?: boolean;
    dynamicSize?: boolean;
    viewProps?: React.HTMLProps<React.HTMLAttributes>;
}

export class ScrollView extends React.Component<ScrollViewProps, any> {
    scrollbar: any;
    private _lastScrollHeight: number;
    private _timer: any;
    
    constructor(props: any, context: any) {
        super(props, context);
    }
    
    componentDidMount() {
        this.instantiate();
    }

    instantiate() {
        if (__DOM__) {
            let rootElement = ReactDOM.findDOMNode(this);
            let viewElement = this.refs["view"] as HTMLElement;

            if (this.props.dynamicSize) {
                this._timer = setInterval(() => {
                    let currentScrollHeight = viewElement.scrollHeight;
                    if (currentScrollHeight !== this._lastScrollHeight) {
                        this.updateScroller();
                        this._lastScrollHeight = currentScrollHeight;
                    }
                }, 200);
            }

            this.scrollbar = new GeminiScrollbar({
                element: rootElement,
                autoshow: this.props.autoshow,
                forceGemini: this.props.forceCustom,
                createElements: false
            }).create();

            this._lastScrollHeight = viewElement.scrollHeight;
        }
    }

    dispose() {
        if (this.scrollbar != null) {
            this.scrollbar.destroy();
            this.scrollbar = null;
        }
        if (this._timer != null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    updateScroller() {
        if (this.scrollbar !== null) {
            this.scrollbar.update();
        }
    }

    componentWillUpdate() {
        this.dispose();
    }

    componentDidUpdate() {
        this.instantiate();
    }

    componentWillUnmount() {
        this.dispose();
    }

    render() {
        let { children, viewProps } = this.props;
        let classNames = StringUtils.joinWithSpaceIfNotEmpty(viewProps.className, "gm-scroll-view");
        let others = _.omit(this.props, ["children", "viewProps"]);
        return (
            <div {...others} ref="root">
                <div className="gm-scrollbar -vertical">
                    <div className="thumb"></div>
                </div>
                <div className="gm-scrollbar -horizontal">
                    <div className="thumb"></div>
                </div>
                <div { ...viewProps } className={classNames} ref="view">
                    {children}
                </div>
            </div>
        );
    }
}