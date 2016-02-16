import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { HeadBuilder } from "../src/modules/core/docHead";
import guards from "../src/modules/core/guards";
import * as path from "path";

class HtmlRenderer {

    getHtmlHead(htmlConfig) {
        let { title, titleTemplate, charset, description, tags, js, css } = htmlConfig;
        
        let builder = new HeadBuilder();
        
        if (guards.checkString(titleTemplate)) {
            builder.setTitleTemplate(titleTemplate);        
        }
        
        if (guards.checkString(title)) {
            builder.setTitle(title);
        }

        if (guards.checkString(charset))
            builder.setCharset(charset);

        if (guards.checkString(description))
            builder.setDescription(description);

        if (typeof (tags) === "string") {
            builder.add(tags);
        }
        else if (tags.constructor === Array) {
            tags.forEach(x => builder.add(x));
        }

        if (css) { css.forEach(x => builder.addCss(x)); }
        if (js) { js.forEach(x => builder.addJs(x)); }

        let head = builder.toString();
        return head;
    }

    render(htmlConfig) {
        let head = this.getHtmlHead(htmlConfig);
        let { templatePath, body } = htmlConfig;
        
        templatePath = "./" + path.relative(__dirname, templatePath);
        let templateFactory = require(templatePath).default;

        let templateComponent = templateFactory({ head, body });
        let html = renderToStaticMarkup(templateComponent);
        
        html = "<!doctype html>" + html;
        return html;
    }
}

export default new HtmlRenderer();