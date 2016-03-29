export interface ITitleService {
    get(): string;
    set(value: string): void;
    reset(): void;
    setTemplate(format: string): void;
    getTemplate(): string;
    setOnEmpty(value: string): void;
}

export interface ITitleTarget {
    get(): string;
    set(value: string): void;
}

export class TitleService implements ITitleService {

    static SubstituteSubject = "%s";

    private _target: ITitleTarget;
    private _template: string = null;
    private _titleOnEmpty: string = null;

    constructor(target: ITitleTarget) {
        this._target = target;
    }

    setTemplate(value: string) {
        this._template = value;
    }

    setOnEmpty(value: string) {
        this._titleOnEmpty = value;
    }

    getTemplate() {
        return this._template || TitleService.SubstituteSubject;
    }

    reset() {
        if (this._titleOnEmpty != null) {
            this._target.set(this._titleOnEmpty);
        } else {
            this.set("");
        }
    }

    set(value: string) {
        let template: string = this.getTemplate();
        let text = template.replace(TitleService.SubstituteSubject, value);
        this._target.set(text);
    }

    get() {
        return this._target.get();
    }
}

export function configureTitle(service: ITitleService, options: DataModules.ITitleServiceData) {
    const { title, titleTemplate, titleOnEmpty } = options;

    if (titleTemplate != null) service.setTemplate(titleTemplate);
    if (titleOnEmpty != null) service.setOnEmpty(titleOnEmpty);
    if (title != null) service.set(title);
}