import { TitleService, ITitleTarget } from "../core/TitleService";

export class TitleServiceFactory {
    static create() {
        return new TitleService(new DomTarget());
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