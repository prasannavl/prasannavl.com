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
        let map = new Map();

        // Modules are { id: number, content: string }
        cssModules.forEach(x => {
            let id = x.id;
            if (id === null || id === undefined) {
                id = externalKey;
            } else if (map.has(id)) {
                return;
            }
            map.set(id, null);
            let icss = { content: x.content, attributes: null, id };
            if (id !== externalKey)
                icss.attributes = { "className": "_svx" };
            inlinedCssModules.push(icss);
        });

        return inlinedCssModules;
    }
}

export default new RendererUtils();