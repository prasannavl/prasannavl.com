import React from "react";
import { IAppContext, AppContext } from "../modules/core/AppContext";
import { IHistoryContext } from "history-next/lib/HistoryContext";
import Expose from "./Expose/index";
import MainView from "./MainView/index";
import { PromiseFactory } from "../modules/StaticCache";

let PropTypes = React.PropTypes;

interface Props extends React.Props<any> {
    context: IAppContext;
}

export class AppContainer extends React.Component<Props, any> {
    private _disposeHistoryListener: () => void = null;

    constructor(props: Props, context: any) {
        super(props, context);
    }

    getChildContext() {
        return this.props.context;
    }

    getComponentForContext(context: IHistoryContext) {
        return context.pathname === "" ? Expose : MainView;
    }

    update(context: IHistoryContext) {
        const component = this.getComponentForContext(context);
        this.setState({ component: component });
    }

    componentWillMount() {
        let appContext = this.props.context;
        const history = appContext.services.history;

        history.start();
        this.update(history.current);

        this._disposeHistoryListener = history.listen(context => {
            this.update(context);
            return PromiseFactory.EmptyResolved;
        });
    }

    componentWillUnmount() {
        this._disposeHistoryListener();
    }

    render() {
        return React.createElement(this.state.component);
    }

    static childContextTypes: React.ValidationMap<IAppContext> = {
        services: PropTypes.any,
        state: PropTypes.any,
        events: PropTypes.any,
        rendererState: PropTypes.any,
    };
}

export default AppContainer;