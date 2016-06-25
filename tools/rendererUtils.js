import React from "react"; // eslint-disable-line
import { renderToStaticMarkup } from "react-dom/server";
import path from "path";
import chalk from "chalk";

class RendererUtils {
    renderHtml(htmlConfig) {
        let { templatePath } = htmlConfig;
        
        templatePath = "./" + path.relative(__dirname, templatePath);
        let templateFactory = require(templatePath).default;

        let templateComponent = templateFactory(htmlConfig);
        let html = renderToStaticMarkup(templateComponent);

        html = "<!doctype html>" + html;
        return html;
    }

    getInlinedCssModules(cssModules) {
        if (!(cssModules && Array.isArray(cssModules) && cssModules.length > 0))
            return [];

        let inlinedCssModules = [];
        const externalKey = "_extRoot";

        // Modules are { id: number, content: string }
        cssModules.forEach(x => {
            const id = (x.id === null || x.id === undefined) ? externalKey : x.id;
            let icss = { content: x.content, attributes: null };
            if (id !== externalKey)
                icss.attributes = { "className": "_svx" };
            inlinedCssModules.push(icss);
        });

        return inlinedCssModules;
    }
}

export default new RendererUtils();