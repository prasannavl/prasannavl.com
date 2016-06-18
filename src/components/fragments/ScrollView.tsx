import React from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import ScrollViewModule from "../../modules/scrollview/index";
import { StringUtils } from "../../modules/utils/CoreUtils";
import Features from "../../modules/utils/Features";
import elementResizeDetectorMaker from "element-resize-detector";

export interface ScrollViewProps extends React.HTMLProps<React.HTMLAttributes> {
    autoshow?: boolean;
    forceCustom?: boolean;
    targetProps?: React.HTMLProps<React.HTMLAttributes>;
    dynamicResize?: boolean;
}

export class ScrollView extends React.Component<ScrollViewProps, any> {
    _scrollView: any;
    resizeSensor: any;

    static defaultProps = {
        autoshow: false,
        dynamicResize: true,
        forceCustom: false,
    }

    constructor(props: any, context: any) {
        super(props, context);
    }

    getViewElement() {
        return this.refs["view"] as HTMLElement;
    }

    getResizableElement() {
        let viewElement = this.getViewElement();
        let el: Element = null;
        let childrenCount = viewElement.children.length;
        if (childrenCount !== 1) {
            el = viewElement;
        } else {
            el = viewElement.firstElementChild as Element;
        }
        return el;
    }

    componentDidMount() {
        this.instantiate();
    }

    componentDidUpdate() {
        if (this._scrollView) {
            if (this.props.dynamicResize) {
                let el = this.getResizableElement();
                this.unbindResizeSensor(el);
                // It seems updateScroller is called when an event handler is attached
                // to the resize sensor. So, there's no need to call the updateScroller here
                // again. 
                this.bindResizeSensor(el);
            } else {
                this.updateScroller();
            }
        }
    }


    componentWillUnmount() {
        this.dispose();
    }

    instantiate() {
        let rootElement = ReactDOM.findDOMNode(this) as HTMLElement;

        let _scrollView = new ScrollViewModule({
            element: rootElement,
            autoshow: this.props.autoshow,
            forceCustom: this.props.forceCustom,
            createElements: false,
        }).create();

        if ((_scrollView as any)._created) {
            this._scrollView = _scrollView;
            if (this.props.dynamicResize) {
                let el = this.getResizableElement();
                this.bindResizeSensor(el);
            }
        }
    }

    createResizeSensor() {
        this.resizeSensor = elementResizeDetectorMaker({
            strategy: "scroll"
        });
    }

    bindResizeSensor(element: Element) {
        if (this.resizeSensor == null) this.createResizeSensor();
        this.resizeSensor.listenTo(element, () => {
            this.updateScroller();
        });
    }

    unbindResizeSensor(element: Element) {
        if (this.resizeSensor != null) {
            this.resizeSensor.removeAllListeners(element);
        }
    }

    dispose() {
        if (this.resizeSensor != null) {
            this.resizeSensor.uninstall(this.getResizableElement());
            this.resizeSensor = null;
        }
        if (this._scrollView != null) {
            this._scrollView.destroy();
            this._scrollView = null;
        }
    }

    updateScroller() {
        if (this._scrollView != null) {
            this._scrollView.update();
        }
    }

    render() {
        let { children, targetProps } = this.props;
        let targetClassNames = StringUtils.joinWithSpaceIfNotEmpty(targetProps.className, "scroll-target");
        let others = _.omit(this.props, ["children", "viewProps"]);
        return (
            <div {...others} ref="root">
                <div className="scrollbar -vertical">
                    <div className="thumb"></div>
                </div>
                <div className="scrollbar -horizontal">
                    <div className="thumb"></div>
                </div>
                <div { ...(targetProps as any) } className={targetClassNames} ref="view">
                    {children}
                </div>
            </div>
        );
    }
}