import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";

const PropTypes = React.PropTypes;

class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;

    static contextTypes: React.ValidationMap<IAppContext> = {
        router: PropTypes.any,
        routeFactory: PropTypes.func,
        title: PropTypes.object,
        applyCss: PropTypes.func,
        routeProcessor: PropTypes.object,
        state: PropTypes.object,
    };

    navigateTo(path: string, event: React.SyntheticEvent = null, replaceCurrent: boolean = false) {
        if (event !== null) event.preventDefault();
        try {
        (this.context as any).router.navigate(path, { replace: replaceCurrent });
        } catch (err) {
            console.log("err: " + err);
        }
    }
}

export default Base;