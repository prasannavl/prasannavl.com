import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";
import shallowCompare from "react-addons-shallow-compare";
import { IHistoryContext } from "../modules/history/index";

const PropTypes = React.PropTypes;

export class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;

    static contextTypes: React.ValidationMap<IAppContext> = {
        historyContext: PropTypes.object,
        history: PropTypes.object,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    };

    navigateTo(path: string, replaceCurrent: boolean = false, event: React.SyntheticEvent = null) {
        if (event !== null) event.preventDefault();
        if (replaceCurrent) {
            this.context.history.replace(path);
        } else {
            this.context.history.push(path);
        }
    }
}

export class BaseWithHistoryContext<P, S> extends Base<P, S> {

    private childContext = { historyContext: this.context.historyContext };

    static childContextTypes = {
        historyContext: PropTypes.object,
    };

    getChildContext() {
        return this.childContext;
    }

    setHistoryContext(context: IHistoryContext) {
        this.childContext.historyContext = context;
    }
}

export class StatelessBase<P> extends Base<P, any> {
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

export class StatelessComponent<P> extends React.Component<P, any> {
    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}