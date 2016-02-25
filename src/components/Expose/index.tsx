import * as React from "react";
import { Link } from "react-router";
import createStyled from "../../modules/core/createStyled";

const style = require("./style.scss") as StyleWrapper; 

class Expose extends React.Component<any, any> {
  constructor() {
    super();
  }
  
  getLinkIcon(classNames: string, linkSrc: string) {
      return (<a href={ linkSrc } className={ classNames }></a>);
  }
  
  forward(ev: React.SyntheticEvent) {
      ev.preventDefault();
  }
  
  render() {
      return (
        <div id="expose">
            <div id="content">
                <header>
                    <h1>Prasanna V. Loganathar</h1>
                    <h2>A <a href="https://xkcd.com/242/">mad-man</a> with a computer, walking the grove between <a href="http://what-if.xkcd.com/">Science</a> and <a href="https://xkcd.com/387/">Technology</a>.</h2>
                </header>

                <section>
                    <address className="icons">
                    { this.getLinkIcon("icon-twitter2", "https://www.twitter.com/prasannavl") }
                    { this.getLinkIcon("icon-github", "https://www.github.com/prasannavl") }
                    { this.getLinkIcon("icon-facebook-square", "https://www.facebook.com/prasannavl") }
                    { this.getLinkIcon("icon-envelope email", "mailto:Prasanna V. Loganathar <pvl@prasannavl.com>") }
                    </address>
                    
                    <div className="info">
                        And I write stuff <b><a href="">here</a></b>.
                    </div>
                    
                    <a href="" id="arrow" className="icon-arrow_forward" onClick={this.forward.bind(this)}></a>
                    <Link to="/hello2" style={{ display: "block"}}>Go to static 2</Link>
                    <Link to="/hello3" style={{ display: "block"}}>Go to static 3</Link>
                </section>
            </div>
        </div>
      );
  }
}

export default createStyled(Expose, style);