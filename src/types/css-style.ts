declare namespace CssStyle {
    export interface StyleWrapper {
        getCssModule(): CssModule;
        insertIntoDom(): () => void;
    }

    export interface StyleApplierFunction {
        (styles: StyleWrapper): void;
    }

    export interface CssModule {
        id: string,
        content: string,
    }
}

