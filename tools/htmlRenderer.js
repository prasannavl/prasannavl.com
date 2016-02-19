import React from "react";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { HeadBuilder } from "../src/modules/core/docHead";
import guard from "../src/modules/core/guard";
import * as path from "path";

class HtmlRenderer {

    getHtmlHead(htmlConfig) {
        let { title, titleTemplate, charset, description, tags, js, css, tagsEnd } = htmlConfig;
        
        let builder = new HeadBuilder();
        
        if (guard.checkString(titleTemplate)) {
            builder.setTitleTemplate(titleTemplate);        
        }
        
        if (guard.checkString(title)) {
            builder.setTitle(title);
        }

        if (guard.checkString(charset))
            builder.setCharset(charset);

        if (guard.checkString(description))
            builder.setDescription(description);

        if (typeof (tags) === "string") {
            builder.add(tags);
        }
        else if (tags && tags.constructor === Array) {
            tags.forEach(x => builder.add(x));
        }

        if (css) { css.forEach(x => builder.addCss(x)); }
        if (js) { js.forEach(x => builder.addJs(x)); }
        
        if (typeof (tagsEnd) === "string") {
            builder.add(tags);
        }
        else if (tagsEnd && tagsEnd.constructor === Array) {
            tagsEnd.forEach(x => builder.add(x));
        }

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