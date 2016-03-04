import React from "react"; //eslint-disable-line
import { renderToStaticMarkup } from "react-dom/server";
import path from "path";

export class HtmlRenderer {
      
    static render(htmlConfig) {
        let { templatePath, title, description, js, css, content, inlineCss, canonical } = htmlConfig;
                
        templatePath = "./" + path.relative(__dirname, templatePath);
        let templateFactory = require(templatePath).default;

        let templateComponent = templateFactory({ title, description, css, js, content, inlineCss, canonical });
        let html = renderToStaticMarkup(templateComponent);
        
        html = "<!doctype html>" + html;
        return html;
    }
    
    static renderContent(htmlConfig, content, cssModules) {
        let config = Object.assign({}, htmlConfig, { content });
    
        if (cssModules)
        {
            if (config.inlineCss) config.inlineCss = [].concat(config.inlineCss);
            else config.inlineCss = [];
            
            let modules = {};
            const externalKey = "_extRoot";
            
            // Organize as `{ (id): [] }` for modules.
            cssModules.forEach(x => {
                const id = x.id === null || x.id === undefined ? externalKey : x.id;
                let m = modules[id];
                if (!m) {
                    m = modules[id] = [];
                }
                m.push(x.content);
            });
            
            // Push each item in module to inlineCss as { content, attr }
            Object.keys(modules).forEach(id => {
                let i = 0;
                modules[id].forEach(contents => {
                    let icss = { content: contents, attributes: null };
                    if (id !== externalKey)
                        icss.attributes = { "className": "_svx" };
                    config.inlineCss.push(icss);
                    i++;
                });
            });
            
        }
        const html = HtmlRenderer.render(config);
        return html;
    }
}