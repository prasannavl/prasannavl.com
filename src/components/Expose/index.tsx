import * as React from "react";
import { Base } from "../Base";
import createStyled from "../../modules/core/createStyled";
import Tagline from "../fragments/Tagline";
import { IAppContext } from "../../modules/core/AppContext";

const style = require("./style.scss") as any;

class Expose extends Base<any, any> {

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
                <header>
                        <h1>Prasanna V. Loganathar</h1>
                    <Tagline />
                </header>
                    <section>
                        <address className="icons">
                            <a href="https://www.twitter.com/prasannavl" className="icon-twitter" target="_blank"></a>
                            <a href="https://www.github.com/prasannavl" className="icon-mark-github" target="_blank"></a>
                            <a href="https://www.facebook.com/prasannavl" className="icon-facebook-square" target="_blank"></a>
                            <a href="mailto:Prasanna V. Loganathar <pvl@prasannavl.com>" className="icon-envelope"></a>
                        </address>
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