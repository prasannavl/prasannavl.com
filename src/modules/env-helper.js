export class EnvHelper {
    constructor() {
        this.nodeEnv = process.env.NODE_ENV;
        this.devMode = this.env === "development";
        this.snapMode = navigator.userAgent === "reactSnap";
    }

    onLoaded(fn) {
        document.addEventListener("DOMContentLoaded", fn);
    }
}
