interface StyleWrapper {
    getCssModule(): CssModule;
    insertIntoDom(): () => void;
}

interface ApplyStyleFunction {
    (styles: StyleWrapper): void;
}

interface CssModule {
    id: string,
    content: string,
}