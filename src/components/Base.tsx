import React from "react";
import { IAppContext } from "../modules/core/AppContext";
import shallowCompare from "react-addons-shallow-compare";
import { IHistoryContext } from "history-next";

const PropTypes = React.PropTypes;

export class StatelessComponent<P> extends React.Component<P, any> {
    constructor(props: P, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}

// export interface HistoryState {
//     previous: {
//         pathname: string;
//         key: string;
//         scrollTop: number;
//     };
//     data: any;
// }

// export class HistoryStateFactory {
//     static create(previous: string = null, data: any = null) {
//         return { previous, data };
//     }

//     static createEmpty() {
//         return { previous: null, data: null } as HistoryState;
//     }
// }

export class Base<P, S> extends React.Component<P, S> {
    context: IAppContext;

    constructor(props: any, context: any) {
        super(props, context);
    }

    componentWillMount() { }
    componentWillUnmount() { }

    getServices() {
        return this.context.services;
    }

    getCurrentHistoryContext() {
        return this.getServices().history.current;
    }

    // getCurrentHistoryState(context?: IHistoryContext): HistoryState {
    //     context = context || this.getServices().history.current;
    //     let res = context.state;
    //     if (!res) {
    //         res = HistoryStateFactory.create(this.getServices().history.current.pathname);
    //         context.state = res;
    //     }
    //     return res;
    // }

    navigateTo(path: string, replaceCurrent: boolean = false, ev: React.SyntheticEvent | UIEvent = null, state: any = null) {
        if (ev !== null) {
            ev.preventDefault();
        }
        const history = this.getServices().history;
        // let nextState = HistoryStateFactory.create(history.current.pathname, state);
        let nextState = state;
        if (replaceCurrent) {
            history.replace(path, nextState);
        } else {
            history.push(path, nextState);
        }
    }

    static contextTypes: any = {
        services: PropTypes.any,
        state: PropTypes.any,
        events: PropTypes.any,
        rendererState: PropTypes.any,
    };
}

export class StatelessBase<P> extends Base<P, any> {
    constructor(props: P, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return shallowCompare(this, nextProps, nextState);
    }
}