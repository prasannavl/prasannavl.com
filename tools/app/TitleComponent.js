import { TitleComponent } from "../../src/modules/core/TitleComponent";

export class TitleComponentFactory {
    static create() {
        return new TitleComponent(new MemoryTarget());
    }
}

export class MemoryTarget {
    constructor() {
        this.value = null;
    }
    get() {
        return this.value;
    }

    set(value) {
        this.value = value;
    }
}