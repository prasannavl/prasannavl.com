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
    match({ routes, location: req.url }, (err, redirect, props) => {
        const appHtml = renderToString(<RouterContext {...props}/>)
        res.send(renderPage(appHtml))
    });

    function renderPage(appHtml) {
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
        let config = Object.assign({}, htmlConfig, { body: appHtml });
        let html = htmlRenderer.render(config);
        return html;
    }
}
