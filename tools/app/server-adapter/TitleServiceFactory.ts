import { TitleService, ITitleTarget } from "../../../src/modules/core/TitleService";

export class TitleServiceFactory {
    static create() {
        return new TitleService(new MemoryTarget());
    }
}

export class MemoryTarget implements ITitleTarget  {
    private _value: string = null;

    get() {
        return this._value;
    }

    set(value: string) {
        this._value = value;
    }
}