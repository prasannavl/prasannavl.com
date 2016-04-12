import React from "react";
import { IAppContext } from "../modules/core/AppContext";
import shallowCompare from "react-addons-shallow-compare";
import { IHistoryContext, HistoryContext } from "history-next";
const PropTypes = React.PropTypes;

export class StatelessComponent<P> extends React.Component<P, any> {
    constructor(props: P, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

export class Base<P, S> extends React.Component<P, S> {
    context: IAppContext;

    constructor(props: any, context: any) {
        super(props, context);
    }

    componentWillMount() { }
    componentWillUnmount() { }

    getServices() {
        return this.context.services;
    }

    navigateTo(path: string, replaceCurrent: boolean = false, ev: React.SyntheticEvent | UIEvent = null, state: any = null) {
        if (ev !== null) {
            ev.preventDefault();
        }
        const history = this.getServices().history;
        if (replaceCurrent) {
            history.replace(path, state);
        } else {
            history.push(path, state);
        }
    }

    static contextTypes: any = {
        historyContext: PropTypes.any,
        services: PropTypes.any,
        state: PropTypes.any,
        rendererState: PropTypes.any,
    };
}

export class StatelessBase<P> extends Base<P, any> {
    constructor(props: P, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

export class BaseWithHistoryContext<P, S> extends Base<P, S> {
    private _childContext: { historyContext: IHistoryContext };
    private _disposeHistoryListener: () => void = null;

    constructor(props: P, context: IAppContext) {
        super(props, context);
        this._childContext = { historyContext: context.historyContext };
    }

    getChildContext() {
        return this._childContext;
    }

    setHistoryContext(context: IHistoryContext) {
        this._childContext.historyContext = context;
    }

    componentWillMount() {
        super.componentWillMount();
        const history = this.getServices().history;
        this._disposeHistoryListener = history.listen((ctx, next) => {
            // Ensure this isn't run if it was already disposed.
            if (this._disposeHistoryListener !== null) {
                this.setHistoryContext(ctx);
                this.onHistoryChange(ctx);
            }
            return next(ctx);
        });
    }

    componentWillUnmount() {
        this._disposeHistoryListener();
        // Set this to null as an indication that it has already been unmounted.
        this._disposeHistoryListener = null;
        super.componentWillUnmount();
    }

    onHistoryChange(context: IHistoryContext) { }

    static childContextTypes = {
        historyContext: PropTypes.object,
    };
}

export class StatelessBaseWithHistory<P> extends BaseWithHistoryContext<P, any> {
    constructor(props: P, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

interface BaseFactoryOptions {
    title?: string;
    resetTitle?: boolean;
    shallowRender?: boolean;
}

export class BaseFactory {
    static create<P>(component: JSX.Element, options: BaseFactoryOptions) {
        const title = options.title;
        let opts = {
            performTitleSet: title != null,
            performTitleReset: options.resetTitle ? true : false,
        };

        let klass = options.shallowRender ? StatelessBase : Base;

        let extendedBaseClass = class extends klass<P, any> {
            componentWillMount() {
                super.componentWillMount();
                let self = this;
                let services = self.getServices();
                if (opts.performTitleSet) {
                    services.title.set(title);
                } else if (opts.performTitleReset) {
                    services.title.reset();
                }
            }

            render() { return component; }
        };
        return extendedBaseClass;
    }

    static createElement<P>(component: JSX.Element, options: BaseFactoryOptions, props?: P) {
        return React.createElement(BaseFactory.create(component, options), props);
    }
}