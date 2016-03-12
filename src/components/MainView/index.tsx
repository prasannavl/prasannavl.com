import * as React from "react";
import Sidebar from "../Sidebar/index";
import ContentView from "../ContentView/index";
import LoremSegment from "../fragments/Lorem";
import createStyled from "../../modules/core/createStyled";
import { Base } from "../Base";
import Intents from "./Intents";
import * as Rx from "rxjs";
import Expose from "../Expose/index";

let style = require("./style.scss") as any;

class MainView extends Base<any, any> {

    private intents = new Intents();
    private subscriptions: Rx.Subscription[] = [];

    constructor() {
        super();
    }

    componentWillMount() {
        this.subscriptions.push(this.intents.showExposeStream
            .startWith(this.getInitialValue())
            .distinctUntilChanged()
            .subscribe(x => {
                this.setState({
                    showExpose: x
                });
            }));
    }

    componentWillUnmount() {
        this.subscriptions.forEach(x => x.unsubscribe());
    }

    getInitialValue() {
        return this.context.historyContext.pathname === "/";
    }

    renderExpose() {
        const view = (<Expose/>);
        return view;
    }

    renderNormalView() {
         const view = (
            <div className={style.root}>
                <Sidebar />
                <ContentView />
                <div className="clear"></div>
            </div>
        );
        return view;
    }

    render() {
        return this.state.showExpose ? this.renderExpose() : this.renderNormalView();
    }
}

export default createStyled(MainView, style);