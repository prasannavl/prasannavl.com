/* eslint-disable no-console */
import config, { OUTPUT_PATH, DEVSERVER_HOST, DEVSERVER_PORT, DEVSERVER_PUBLIC_PATH, HTML_CONFIG_ARTIFACT_PATH, ARTIFACTS_PATH, WEBPACK_STATS_FILENAME } from "../config";
import express from "express";
import compression from "compression";
import * as path from "path";
import AppRenderer from "./app/AppRenderer";
import utils from "./utils";
import configConstants from "../configConstants";

const rootPath = OUTPUT_PATH;
let runNow = utils.hasCommandLineArg("run");

function createAppServer(host, port, rootPath, runNow) {
    let app = express();
    app.use(compression());
    let webPackStats = getWebpackStats();
    let appRenderer = new AppRenderer(
        config,
        webPackStats,
        getHtmlConfig(webPackStats)
    );

    app.use(function(req, res, next) {
        //console.log(req.url);
        next();
    });

    app.use(express.static(rootPath + "/"));

    app.get("*", function(req, res) {
        //useStaticFile(req, res);
        appRenderer.run(req, res);
    });

    if (runNow) {
        app.listen(port, () => {
            console.log(`Server listening on http://${host}:${port}`);
            let open = require("open");
            open(`http://${host}:${port}/`);
        });
    }

    return app;
}

function getWebpackStats() {
    return utils.getFromJsonFile(path.join(ARTIFACTS_PATH, WEBPACK_STATS_FILENAME))
}

function getHtmlConfig(webpackStats) {
    let htmlConfig = utils.getFromJsonFile(HTML_CONFIG_ARTIFACT_PATH); 
    let addendum = DEVSERVER_PUBLIC_PATH.endsWith("/") ? DEVSERVER_PUBLIC_PATH : DEVSERVER_PUBLIC_PATH + "/";
    let webpackJs = [].concat(webpackStats.assetsByChunkName.main).filter(x => x.endsWith(".js")).map(x => addendum + x);
    let webpackCss = [].concat(webpackStats.assetsByChunkName.main).filter(x => x.endsWith(".css")).map(x => addendum + x);
    htmlConfig.js = htmlConfig.js.concat(webpackJs);
    htmlConfig.css = htmlConfig.css.concat(webpackCss);
    return htmlConfig;
}

// function useStaticFile(req, res) {
//     res.sendFile(rootPath + DEVSERVER_INDEX_PATH_RELATIVE);
// }
