import * as React from "react";
import { PropTypes } from "react";
import { IAppContext } from "../modules/core/AppContext";
import Expose from "./Expose/index";
import MainView from "./MainView/index";
import { IHistoryContext } from "history-next";

interface Props extends React.Props<AppContainer> {
    context: IAppContext;
}

class AppContainer extends React.Component<Props, any> implements React.ChildContextProvider<IAppContext> {

    static childContextTypes: React.ValidationMap<IAppContext> = {
        appContainer: PropTypes.any,
        historyContext: PropTypes.object,
        history: PropTypes.object,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    };

    getChildContext() {
        return this.props.context;
    }

    getComponentForContext(context: IHistoryContext) {
        return context.pathname === "/" ? Expose : MainView;
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
        const history = this.props.context.history;

        history.listen((ctx, next) => {
            this.setup(ctx);
            return next(ctx);
        });

        history.start();
        this.setup(history.context);
    }

    render() {
        return React.createElement(this.state.component);
    }
}

export const ReactElement = React.createElement(AppContainer);

export default AppContainer;