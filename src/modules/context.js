import { EnvHelper } from "./env-helper";
import { PrerenderHelper } from "./prerender-helper";

export class Context {
    constructor() {
        this.envHelper = new EnvHelper();
        this.preRenderer = new PrerenderHelper();
    }
}

export default new Context();