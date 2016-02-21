import env from "fbjs/lib/ExecutionEnvironment";
import { sprintf } from "sprintf-js";

export class TitleComponent {
    constructor() {
        if (env.canUseDOM) {
            this.setRaw = this._domSet;
            this.get = this._domGet;
        }
        else {
            this.setRaw = this._memSet;
            this.get = this._memGet;
            this._value = null;
        }

        this._template = null;
    }

    setTemplate(value) {
        this._template = value;
    }

    set(...values) {
        let template = this._template || "%s";
        this.setRaw(sprintf(template, ...values));
    }

    _memGet() {
        return this._value;
    }

    _memSet(value) {
        this._value = value;
    }

    _domGet() {
        return document.title;
    }

    _domSet(value) {
        document.title = value;
    }
}

export default new TitleComponent();