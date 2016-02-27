import * as React from "react";
import { PropTypes } from "react";
import { IAppContext } from "../modules/core/AppContext";

interface Props extends React.Props<AppContainer> {
    context: IAppContext;
}

class AppContainer extends React.Component<Props, any> implements React.ChildContextProvider<IAppContext> {

    static childContextTypes:React.ValidationMap<IAppContext> = {
        history: PropTypes.object,
        routes: PropTypes.object,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeHandlerDescriptor: PropTypes.object,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    }

    constructor(props : Props, context: any) {
        super(props, context);
    }

    getChildContext() {
        return this.props.context;
    }

    render() {
        return this.props.children as JSX.Element;
    }
}

export default AppContainer;