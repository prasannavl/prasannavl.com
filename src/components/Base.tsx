import * as React from "react";
import { IAppContext } from "../modules/core/AppContext";
import shallowCompare from "react-addons-shallow-compare";

const PropTypes = React.PropTypes;

export class Base<P, S> extends React.Component<P, S> {

    context: IAppContext;

    static contextTypes: React.ValidationMap<IAppContext> = {
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