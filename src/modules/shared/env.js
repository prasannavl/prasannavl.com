export class EnvHelper {
    constructor() {
        this.nodeEnv = process.env.NODE_ENV;
        this.devMode = this.nodeEnv === "development";
        this.snapMode = navigator.userAgent === "reactSnap";
    }

    onLoaded(fn) {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

export default new EnvHelper();
