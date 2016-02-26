import * as React from "react";
import { Link } from "react-router";
import createStyled from "../../modules/core/createStyled";

const style = require("./style.scss") as StyleWrapper;

class Expose extends React.Component<any, any> {

    constructor() {
        super();
    }

    componentWillUnMount() {
    }

    getLinkIcon(classNames: string, linkSrc: string) {
        return (<a href={ linkSrc } className={ classNames }></a>);
    }

    createCastAway(element: HTMLElement): TimelineMax {
        const t = new TimelineMax();
        t.to(element, 0.3, { x: -window.innerWidth + 300, opacity: 0.4 });
        return t;
    }

    forward(ev: React.SyntheticEvent) {
        ev.preventDefault();
        const exposeElement = this.refs["expose"] as HTMLElement;
        const castAwayTimeline = this.createCastAway(exposeElement);
        castAwayTimeline.play();
        setTimeout(() => castAwayTimeline.reverse(), 2000);
    }

    render() {
        return (
            <div id="expose" ref="expose">
                <div id="content">
                    <header>
                        <h1>Prasanna V. Loganathar</h1>
                        <h2>A <a href="https://xkcd.com/242/">mad-man</a> with a computer, walking the grove between <a href="http://what-if.xkcd.com/">Science</a> and <a href="https://xkcd.com/387/">Technology</a>.</h2>
                    </header>

                    <section>
                        <address className="icons">
                            { this.getLinkIcon("icon-twitter", "https://www.twitter.com/prasannavl") }
                            { this.getLinkIcon("icon-mark-github", "https://www.github.com/prasannavl") }
                            { this.getLinkIcon("icon-facebook-square", "https://www.facebook.com/prasannavl") }
                            { this.getLinkIcon("icon-envelope email", "mailto:Prasanna V. Loganathar <pvl@prasannavl.com>") }
                        </address>

                        <div className="info">
                            And I write stuff <b><a href="">here</a></b>.
                        </div>

                        <a href="" id="arrow" className="icon-arrow_forward" onClick={this.forward.bind(this) }></a>
                    </section>
                </div>
            </div>
        );
    }
}

export default createStyled(Expose, style);