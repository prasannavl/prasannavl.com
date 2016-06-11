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
    scrollViewModule: any;
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
    
    componentDidMount() {
        this.instantiate();
        if (this.props.dynamicResize && this.scrollViewModule) {
            let viewElement = this.getViewElement();
            let el: Element = null;
            let childrenCount = viewElement.children.length;
            if (childrenCount !== 1) {
                el = viewElement;
            } else {
                el = viewElement.firstElementChild as Element;
            }
            this.bindResizeSensor(el);
        }
    }

    componentDidUpdate() {
        this.updateScroller();
        if (this.props.dynamicResize && this.scrollViewModule) {
            let viewElement = this.getViewElement();            
            let el: Element = null;
            let childrenCount = viewElement.children.length;
            if (childrenCount !== 1) {
                el = viewElement;
            } else {
                el = viewElement.firstElementChild as Element;
            }
            this.unbindResizeSensor(el);
            this.bindResizeSensor(el);
        }
    }

    componentWillUnmount() {
        this.dispose();
    }

    instantiate() {
        let rootElement = ReactDOM.findDOMNode(this) as HTMLElement;

        let scroller = new ScrollViewModule({
            element: rootElement,
            autoshow: this.props.autoshow,
            forceCustom: this.props.forceCustom,
            createElements: false,
        }).create();

        if ((scroller as any)._created) {
            this.scrollViewModule = scroller;
            if (this.props.dynamicResize) {
                this.createResizeSensor();
            }
        }
    }

    createResizeSensor() {
        this.resizeSensor = elementResizeDetectorMaker({
            strategy: "scroll"
        });
    }

    bindResizeSensor(element: Element) {
        if (this.resizeSensor === null) this.createResizeSensor();
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
        if (this.scrollViewModule != null) {
            this.scrollViewModule.destroy();
            this.scrollViewModule = null;
        }
        if (this.resizeSensor != null) {
            this.resizeSensor = null;
        }
    }

    updateScroller() {
        if (this.scrollViewModule != null) {
            this.scrollViewModule.update();
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