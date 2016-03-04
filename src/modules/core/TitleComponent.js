import { sprintf } from "sprintf-js";

export class TitleComponent {
    
    constructor(target) {
        this.target = target;
        this.template = null;
    }

    setTemplate(value) {
        this.template = value;
    }
    
    getTemplate() {
        return this.template || "%s";
    }

    set(...values) {
        let template = this.getTemplate();
        let text = sprintf(template, ...values);
        this.target.set(text);
    }
    
    get() {
        return this.target.get();
    }
}