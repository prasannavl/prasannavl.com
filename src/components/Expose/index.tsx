import * as React from "react";
import { Link } from "react-router";
import Base from "../Base";
import createStyled from "../../modules/core/createStyled";
import Header from "../Header/index";
import Address from "../Address/index";
import { IAppContext } from "../../modules/core/AppContext";

const style = require("./style.scss") as any;

class Expose extends Base<any, any> {

    constructor() {
        super();
    }    

    createCastAway(element: HTMLElement): TimelineMax {
        const t = new TimelineMax();
        t.to(element, 0.3, { x: -window.innerWidth + 300, opacity: 0.4 });
        return t;
    }

    forward(ev: React.SyntheticEvent) {
        ev.preventDefault();
        const exposeElement = this.refs["expose"] as HTMLElement;
        // const castAwayTimeline = this.createCastAway(exposeElement);
        // castAwayTimeline.play();
        // setTimeout(() => castAwayTimeline.reverse(), 2000);
        this.navigateTo("/overview");
    }

    render() {
        return (
            <div className={style.root} ref="expose">
                <div id="content">
                    <Header />
                    <section>
                        <Address />
                        <div className="info">
                            And I write stuff <b><a href="">here</a></b>.
                        </div>
                        <a href="/overview" id="arrow" className="icon-arrow_forward" onClick={this.forward.bind(this) }></a>
                    </section>
                </div>
            </div>
        );
    }
}

export default createStyled(Expose, style);