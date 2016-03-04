import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";
import { Router } from "react-router-component";

const PropTypes = React.PropTypes;

class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;

    get router(): Router {
        return (this.context as any).router;
    }

    static contextTypes: React.ValidationMap<IAppContext> = {
        router: PropTypes.any,
        routeFactory: PropTypes.func,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    };

    getPath() {
        return this.router.getPath();
    }

    makeHref(path: string) {
        return this.router.makeHref(path);
    }

    navigateTo(path: string, replaceCurrent: boolean = false, event: React.SyntheticEvent = null) {
        if (event !== null) event.preventDefault();
        this.router.navigate(path, { replace: replaceCurrent });
    }
}

export default Base;