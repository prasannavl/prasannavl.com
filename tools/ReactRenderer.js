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
                    let css = [];
                    renderProps.insertCss = (styles) => css.push(styles._getCss());
                    let appHtml = renderToString(React.createElement(RouterContext, { ...renderProps }));
                    res.status(200).send(this.renderPage(appHtml, css));                
                } else {
                    res.status(404).send('Not found')
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

    renderPage(body, styles) {
        let htmlConfig = Object.assign({}, this.htmlConfig, { body });
        if (styles && styles.length)
            htmlConfig.tags.push(`<style type="text/css">${styles.join('') }</style>`);
        let html = htmlRenderer.render(htmlConfig);
        return html;
    }
}