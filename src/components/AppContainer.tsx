import React from "react";
import { PropTypes } from "react";
import { IAppContext } from "../modules/core/AppContext";
import Expose from "./Expose/index";
import MainView from "./MainView/index";
import { IHistoryContext } from "history-next";

interface Props extends React.Props<AppContainer> {
    context: IAppContext;
}

class AppContainer extends React.Component<Props, any> {

    static childContextTypes: React.ValidationMap<IAppContext> = {
        historyContext: PropTypes.any,
        services: PropTypes.any,
        state: PropTypes.any,
        rendererState: PropTypes.any,
    };

    private _disposeHistoryListener: () => void = null;

    getChildContext() {
        return this.props.context;
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

    componentWillUnmount() {
        this._disposeHistoryListener();
    }

    render() {
        return React.createElement(this.state.component);
    }
}

export default AppContainer;