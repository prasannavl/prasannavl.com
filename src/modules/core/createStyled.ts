import React from "react";
import { IAppContext } from "./AppContext";

function getDisplayName(component: any) {
    let name = component.displayName || component.name || "Component";
    return `Styled(${name})`;
}

function getCssApplier(context: IAppContext) {
    return context.services.applyCss;
}

let createStyled: <T>(InnerComponent: T, ...styles: any[]) => T;

if (__DOM__) {

    let refTracker: any = {};
    let createId: () => number;
    (function () {
        let id = 0;
        createId = function () {
            return id++;
        };
    })();

    function createStyledForDom<T>(InnerComponent: T, ...styles: any[]) {
        class StyledComponent extends React.Component<any, any> {
            static displayName = getDisplayName(InnerComponent);
            static cacheKey = "c" + createId();

            static contextTypes: any = {
                services: React.PropTypes.any,
            };

            componentWillMount() {
                let key = StyledComponent.cacheKey;
                let trackerObj = refTracker[key];
                if (!trackerObj) {
                    const applyCss = getCssApplier(this.context as IAppContext);
                    trackerObj = {
                        refCount: 1,
                        removeCss: applyCss.apply(null, styles)
                    };
                    refTracker[key] = trackerObj;
                } else {
                    trackerObj.refCount++;
                }
            }

            componentWillUnmount() {
                let key = StyledComponent.cacheKey;
                let trackerObj = refTracker[key];
                if (trackerObj) {
                    let refCount = trackerObj.refCount;
                    if (refCount > 1) {
                        trackerObj.refCount--;
                    } else {
                        delete refTracker[key];
                        setTimeout(trackerObj.removeCss, 0);
                    }
                }
            }

            render() {
                return React.createElement(InnerComponent as any, this.props);
            }
        }
        return StyledComponent;
    }

    createStyled = createStyledForDom;

} else {

    function createStyledHeadless<T>(InnerComponent: T, ...styles: any[]) {
        class StyledComponent extends React.Component<any, any> {
            static displayName = getDisplayName(InnerComponent);
            static contextTypes: any = {
                services: React.PropTypes.any,
            };
            private removeCss: () => void;

            componentWillMount() {
                let applier = getCssApplier(this.context as IAppContext);
                this.removeCss = applier.apply(null, styles);
            }

            componentWillUnmount() {
                let remove = this.removeCss;
                if (remove)
                    remove();
            }

            render() {
                return React.createElement(InnerComponent as any, this.props);
            }
        }
        return StyledComponent;
    }

    createStyled = createStyledHeadless;
}

export default createStyled;