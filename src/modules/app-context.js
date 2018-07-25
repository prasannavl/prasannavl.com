import { EnvHelper } from "./env-helper";
import { PrerenderHelper } from "./prerender-helper";
import { renderFactory } from "./render-utils";
import { Router } from "./router";
import resolver from "../routes";

export class Context {
    constructor() {
        this.envHelper = new EnvHelper();
        this.preRenderer = new PrerenderHelper();
        this.renderFactory = (Component, el) => renderFactory(Component, el, this);
        this.router = new Router(resolver);
    }
}

export default new Context();