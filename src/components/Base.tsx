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
        historyContext: PropTypes.object,
        history: PropTypes.object,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    };

    addDisposable(subscription: Rx.Subscription) {
        this.subscriptions.push(subscription);
    }

    removeDisposable(subscription: Rx.Subscription) {
        this.subscriptions.splice(this.subscriptions.indexOf(subscription), 1);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    navigateTo(path: string, replaceCurrent: boolean = false, ev: React.SyntheticEvent = null) {
        if (ev !== null) {
            ev.preventDefault();
        }
        if (replaceCurrent) {
            this.context.history.replace(path);
        } else {
            this.context.history.push(path);
        }
    }
}

export class BaseWithHistoryContext<P, S> extends Base<P, S> {

    private childContext = { historyContext: this.context.historyContext };
    private disposeHistoryListener: () => void = null;

    static childContextTypes = {
        historyContext: PropTypes.object,
    };

    getChildContext() {
        return this.childContext;
    }

    setHistoryContext(context: IHistoryContext) {
        this.childContext.historyContext = context;
    }

    componentWillMount() {
        super.componentWillMount();
        this.disposeHistoryListener = this.context.history.listen((ctx, next) => {
            // Make sure this isn't run if it was already unmounted.
            if (this.disposeHistoryListener !== null) {
                this.setHistoryContext(ctx);
                this.onHistoryChange(ctx);
            }
            return next(ctx);
        });
    }

    componentWillUnmount() {
        this.disposeHistoryListener();
        // Set this to null as an indication that it has already been unmounted.
        this.disposeHistoryListener = null;
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