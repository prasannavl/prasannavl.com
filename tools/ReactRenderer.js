import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import htmlRenderer from "./htmlRenderer";
import webpackRequire from "webpack-require";

export default class ReactRenderer {
     
    constructor(webpackConfig, webpackStats, htmlConfig) {
        this.config = webpackConfig;
        this.htmlConfig = htmlConfig;
        this.webpackStats = webpackStats;
        this.routes = null;
    }

    run(req, res) {
        this.getRoutes(routes => this.matchRoute(routes, req, res));
    }

    matchRoute(routes, req, res) {
        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
                res.status(500).send(error.message)
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search)
            } else if (renderProps) {
                // TODO: renderProps.components or renderProps.routes for
                // "not found" component or route respectively, and send 404 as
                // below for catch-all route.
                let cssModules = [];
                let applyCss = (cssModule) => cssModules.push(cssModule.getCssModule());
                let createElement = (comp, props) => { return React.createElement(comp, { ...props, applyCss }); };
                renderProps.createElement = createElement;
                
                let appHtml = renderToString(React.createElement(RouterContext, renderProps));
                res.status(200).send(this.renderPage(appHtml, cssModules));
            } else {
                res.status(404).send("Not found");
            }
        });
    }

    getRoutes(cb) {
        if (!this.routes) {
            webpackRequire(this.config, require.resolve("../src/routes"), (err, factory, stats, fs) => {
                let routes = factory().default;
                this.routes = routes;
                cb(this.routes);
            });
        } else { cb(this.routes); }
    }

    renderPage(body, cssModules) {
        let cfg = Object.assign({}, this.htmlConfig, { body }, { tagsEnd: this.htmlConfig.tagsEnd ? [].concat(this.htmlConfig.tagsEnd) : [] });
    
        if (cssModules)
        {
            let modules = {};

            cssModules.forEach(x => {
                // Dirty workaround: offset webpack-requrire ids
                // Probably might not work properly. Should look into it.
                const id = x.id + 2;
                let m = modules[id];
                if (!m) {
                    m = modules[id] = [];
                }
                m.push(x.content);
            });
            
            Object.keys(modules).forEach(id => {
                let i = 0;
                modules[id].forEach(contents => {
                    // Fix above then, use this.
                    //cfg.tagsEnd.push(`<style type="text/css" id="__css_${id}-${i}">${contents}</style>`);
                    cfg.tagsEnd.push(`<style type="text/css">${contents}</style>`);                    
                    i++;
                });
            });
        }
        let html = htmlRenderer.render(cfg);
        return html;
    }
}