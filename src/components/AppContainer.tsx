import React from "react";
import { PropTypes } from "react";
import { IAppContext } from "../modules/core/AppContext";
import Expose from "./Expose/index";
import MainView from "./MainView/index";
import { IHistoryContext } from "history-next";
import { init as initializeGoogleAnalytics } from "../modules/ext/googleAnalytics";

interface Props extends React.Props<any> {
    context: IAppContext;
}

export class ContextualComponent<T> extends React.Component<Props, T> {
    constructor(props: Props, context: any) {
        super(props, context);
    }

    getChildContext() {
        return this.props.context;
    }

    static childContextTypes: React.ValidationMap<IAppContext> = {
        historyContext: PropTypes.any,
        services: PropTypes.any,
        state: PropTypes.any,
        rendererState: PropTypes.any,
    };
}

export class AppContainer extends ContextualComponent<any> {
    private _disposeHistoryListener: () => void = null;

    constructor(props: Props, context: any) {
        super(props, context);
    }

    getComponentForContext(context: IHistoryContext) {
        return context.pathname === "" ? Expose : MainView;
    }

    setHistoryContext(context: IHistoryContext) {
        this.props.context.historyContext = context;
    }

    setup(context: IHistoryContext) {
        this.setHistoryContext(context);
        const component = this.getComponentForContext(context);
        this.setState({ component: component });
    }

    componentWillMount() {
        const history = this.props.context.services.history;

        history.start();
        this.setup(history.context);

        this._disposeHistoryListener = history.listen((ctx, next) => {
            this.setup(ctx);
            return next(ctx);
        });
    }

    componentDidMount() {
        initializeGoogleAnalytics("UA-22344363-1");
    }

    componentWillUnmount() {
        this._disposeHistoryListener();
    }

    render() {
        return React.createElement(this.state.component);
    }
}

export default AppContainer;