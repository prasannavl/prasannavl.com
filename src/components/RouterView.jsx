import React from "react";
import { Router } from "../modules/util/router";

export default class RouterView extends React.Component {
    constructor(props) {
        super(props);

        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeAbort = this.onChangeAbort.bind(this);
        this.onChange = this.onChange.bind(this);
        
        this.state = {
            router: null,
            transition: null,
            route: null,
            onChangeStart: this.onChangeStart,
            onChangeAbort: this.onChangeAbort,
            onChange: this.onChange,
        }
    }

    static getDerivedStateFromProps(props, state) {
        let nextState;
        if (state.router !== props.router) {
            RouterView.teardownRouter(props, state);
            nextState = RouterView.initRouter(props, state);
        }
        return nextState ? nextState : null;
    }

    static initRouter(props, state) {
        let r = props.router;
        if (!r) return;
        r.on(Router.CHANGE_STARTED_EVENT, state.onChangeStart);
        r.on(Router.CHANGE_ABORTED_EVENT, state.onChangeAbort);
        r.on(Router.CHANGE_EVENT, state.onChange);
        r.start();
        return { router: r };
    }

    static teardownRouter(props, state) {
        let r = state.router;
        if (!r) return;
        r.stop();
        r.off(Router.CHANGE_STARTED_EVENT, state.onChangeStart);
        r.off(Router.CHANGE_ABORTED_EVENT, state.onChangeAbort);
        r.off(Router.CHANGE_EVENT, state.onChange);
    }

    onChangeStart(ev) {
        let action = this.props.onChangeStart;
        if (action) action(ev);
        if (ev.cancel) return;
        this.setState({ transition: ev });
    }

    onChangeAbort(ev) {
        let action = this.props.onChangeAbort;
        if (action) action(ev);
        if (ev.cancel) return;
        this.setState({ transition: ev });
    }

    onChange(ev) {
        let action = this.props.onChange;
        if (action) action(ev);
        if (ev.cancel) return;
        if (this.props.autoScroll !== false && ev.scroll) {
            window.scroll(0, 0);
            ev.scroll = false;
        }
        this.setState({ route: ev, transition: null });
    }

    render() {
        let { transition, route } = this.state;
        let { render: renderer } = this.props;
        let isLoading = transition !== null;

        let renderProps = {
            isLoading,
            transition,
            route,
        };
        
        if (!renderer) {
            renderer = renderComponent;
        }
        return renderer(renderProps);
    }
}

export function renderComponent(renderProps) {
    let { isLoading, route, transition } = renderProps;
    let Component;
    if (route) {
        Component = route.component;
    }
    return Component ? <Component /> : null;
}