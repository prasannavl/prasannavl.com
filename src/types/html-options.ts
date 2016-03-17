interface HtmlOptions {
    title: string;
    titleTemplate: string;
    titleOnEmpty: string;
    description: string;
    css: string[];
    js: string[];
    content: string;
    inlineCss: [{ content: string, attrs: Object }];
    inlineScripts: [{ content: string, attrs: Object }];
}
