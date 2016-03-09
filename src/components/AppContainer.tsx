import * as React from "react";
import { PropTypes } from "react";
import { IAppContext } from "../modules/core/AppContext";
import { IHistoryContext } from "../modules/history/index";
import Expose from "./Expose/index";
//import MainView from "./MainView/index";

interface Props extends React.Props<AppContainer> {
    context: IAppContext;
}

class AppContainer extends React.Component<Props, any> implements React.ChildContextProvider<IAppContext> {

    static childContextTypes: React.ValidationMap<IAppContext> = {
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
        return context.pathname === "/" ? Expose : null;
    }

    setStateForContext(context: IHistoryContext) {
        const component = this.getComponentForContext(context);
        this.setState({ component: component });
    }

    componentWillMount() {
        const history = this.props.context.history;
        history.listen((ctx, next) => {
            this.setStateForContext(ctx);
            return next(ctx);
        });
        history.start();
        this.setStateForContext(history.context);
    }

    render() {
        if (this.state.component)
            return React.createElement(this.state.component);
        else return <div>Hello there!</div>;
    }
}

export default AppContainer;