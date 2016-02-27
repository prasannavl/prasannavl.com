import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";

const PropTypes = React.PropTypes;

class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;

    static contextTypes: React.ValidationMap<IAppContext> = {
        history: PropTypes.object,
        routes: PropTypes.object,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeHandlerDescriptor: PropTypes.object,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    }

    navigateTo(path: string, replaceCurrent: boolean = false) {
        if (replaceCurrent) this.context.history.replace(path);
        else this.context.history.push(path);
    }
}

export default Base;