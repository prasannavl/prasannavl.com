declare interface ParsedCss {
    getCssModule: () => CssModule;
    insertIntoDom: () => () => void;
}

declare interface CssModule {
    id: string,
    content: string,
}