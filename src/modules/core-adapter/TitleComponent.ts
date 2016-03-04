import { ITitleTarget } from "../core/TitleSpec";
import { TitleComponent } from "../core/TitleComponent";

export class TitleComponentFactory {
    static create() {
        return new TitleComponent(new DomTarget());
    }
}

export class DomTarget implements ITitleTarget {
    get() {
        return document.title;
    }

    set(value: string) {
        document.title = value;
    }
}