import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";
import shallowCompare from "react-addons-shallow-compare";
import * as Rx from "rxjs";
import { IHistoryContext, HistoryContext } from "history-next";

const PropTypes = React.PropTypes;
export class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;
    subscriptions: Rx.Subscription[] = [];

    static contextTypes: React.ValidationMap<IAppContext> = {
        historyContext: PropTypes.any,
        services: PropTypes.any,
        state: PropTypes.any,
        rendererState: PropTypes.any,
    };

    addDisposable(subscription: Rx.Subscription) {
        this.subscriptions.push(subscription);
    }

    removeDisposable(subscription: Rx.Subscription) {
        this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    }

    componentWillMount() { }

    componentWillUnmount() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    getServices() {
        return this.context.services;
    }

    navigateTo(path: string, replaceCurrent: boolean = false, ev: React.SyntheticEvent = null) {
        if (ev !== null) {
            ev.preventDefault();
        }
        const history = this.getServices().history;
        if (replaceCurrent) {
            history.replace(path);
        } else {
            history.push(path);
        }
    }
}

export class BaseWithHistoryContext<P, S> extends Base<P, S> {

    private _childContext = { historyContext: this.context.historyContext };
    private _disposeHistoryListener: () => void = null;

    static childContextTypes = {
        historyContext: PropTypes.object,
    };

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
}

export class StatelessComponent<P> extends React.Component<P, any> {
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

export class StatelessBase<P> extends Base<P, any> {
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

interface BaseFactoryOptions {
    title?: string;
    resetTitle?: boolean;
}

export class BaseFactory {
    static create<P>(component: JSX.Element, options: BaseFactoryOptions) {
        const title = options.title;
        let opts = {
            performTitleSet: title != null,
            performTitleReset: options.resetTitle ? true : false,
        };

        let extendedBaseClass = class extends Base<P, any> {
            componentWillMount() {
                super.componentWillMount();
                if (opts.performTitleSet) {
                    this.getServices().title.set(title);
                } else if (opts.performTitleReset) {
                    this.getServices().title.reset();
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