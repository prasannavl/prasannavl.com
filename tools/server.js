/* eslint-disable no-console */
"use strict";

import { OUTPUT_PATH, DEVSERVER_HOST, DEVSERVER_PORT, DEVSERVER_INDEX_PATH_RELATIVE, HTML_CONFIG_ARTIFACT_FILE, ARTIFACTS_PATH, WEBPACK_STATS_FILENAME } from "../config";
import express from "express";
import compression from "compression";
import * as path from "path";
// imports for react static render
import React from "react";
import { renderToString } from "react-dom/server";
import { match, RouterContext } from "react-router";
import routes from "../src/routes";
import htmlRenderer from "./htmlRenderer";
import fs from "fs";

let htmlConfig = null;
let webpackStats = null;
let app = express();
app.use(compression());

const host = process.env.HOST || DEVSERVER_HOST;
const port = process.env.PORT || DEVSERVER_PORT;

const rootPath = OUTPUT_PATH;

app.use(express.static(rootPath + "/"));

app.get("*", function (req, res) {
    //useStaticFile(req, res);
    useReactRenderer(req, res);
});

app.listen(port, function () {
    console.log(`Server listening on http://${host}:${port}`);
    let open = require("open");
    open(`http://${host}:${port}/`);
});

function useStaticFile(req, res) {
    res.sendFile(rootPath + DEVSERVER_INDEX_PATH_RELATIVE);
}

function useReactRenderer(req, res) {
    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        if (error) {
            res.status(500).send(error.message)
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search)
        } else if (renderProps) {
            // TODO: renderProps.components or renderProps.routes for
            // "not found" component or route respectively, and send 404 as
            // below for catch-all route.
            let appHtml = renderToString(<RouterContext {...renderProps} />);
            res.status(200).send(renderPage(appHtml));
    } else {
            res.status(404).send('Not found')
        }
    });

    function renderPage(body) {
        if (htmlConfig === null)
        {
            let configPath = HTML_CONFIG_ARTIFACT_FILE;
            htmlConfig = JSON.parse(fs.readFileSync(configPath)); 
            
            let statsPath = path.join(ARTIFACTS_PATH, WEBPACK_STATS_FILENAME);
            webpackStats = JSON.parse(fs.readFileSync(statsPath));
            
            // remove source maps.
            let webpackJs = [].concat(webpackStats.assetsByChunkName.main).filter(x => x.endsWith(".js"));
            htmlConfig.js = htmlConfig.js.concat(webpackJs);
        }
        let config = Object.assign({}, htmlConfig, { body });
        let html = htmlRenderer.render(config);
        return html;
    }
}
