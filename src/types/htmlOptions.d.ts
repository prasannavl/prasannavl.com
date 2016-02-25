interface HtmlOptions {
    title: string;
    description: string;
    css: string[];
    js: string[];
    content: string;
    inlineCss: [{ content: string, attrs: Object }];
    inlineScripts: [{ content: string, attrs: Object }];
}
