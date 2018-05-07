import { EnvHelper } from "./env-helper";
import { PrerenderHelper } from "./prerender-helper";
import { renderFactory } from "./render-utils";

export class Context {
    constructor() {
        this.envHelper = new EnvHelper();
        this.preRenderer = new PrerenderHelper();
        this.renderFactory = (Component, el) => renderFactory(Component, el, this);
    }
}

export default new Context();