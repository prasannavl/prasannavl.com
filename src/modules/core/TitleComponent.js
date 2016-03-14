import { sprintf } from "sprintf-js";

export class TitleComponent {
    constructor(target) {
        this._target = target;
        this._template = null;
        this._titleOnEmpty = null;
    }

    setTemplate(value) {
        this._template = value;
    }

    setOnEmpty(value) {
        if (value === null) value = null;
        this._titleOnEmpty = value;
    }
    
    getTemplate() {
        return this._template || "%s";
    }

    set(...values) {
        if (values.length === 0 && this._titleOnEmpty !== null) { 
            this._target.set(this._titleOnEmpty); 
            return;
        }

        let template = this.getTemplate();
        let text = sprintf(template, ...values);
        this._target.set(text);
    }
    
    get() {
        return this._target.get();
    }
}