export interface ITitleComponent {
    get(): string;
    set(...values: any[]): void;
    setTemplate(format: string): void;
    getTemplate(): string;
}

export interface ITitleTarget {
    get(): string;
    set(value: string): void; 
}

export interface ITitleComponentFactory {
    create(): ITitleComponent;
}