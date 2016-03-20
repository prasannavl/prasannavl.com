/* eslint-disable no-console */
import express from "express";
import compression from "compression";
import path from "path";
import AppRenderer from "./AppRenderer";
import Promise from "bluebird";
import utils from "./utils";
import webpackRequire from "webpack-require";

function getServerConfig(webpackConfig) {
    let rootPath = webpackConfig.output.path;
    let indexPath = webpackConfig.devServer.publicPath;
    return { rootPath, indexPath };
}

export function createAppHandlerAsync(webpackConfig) {
    let htmlConfig = getServerHtmlConfig(webpackConfig);
    return getContextManagerFactory(webpackConfig)
        .then(contextManagerFactory => { 
            let appRenderer = new AppRenderer(contextManagerFactory, htmlConfig);
            return appRenderer.run.bind(appRenderer);
        });
}

export function createServer(rootPath, indexPath, handler = null, log = false) {
    let server = express();
    server.use(compression());

    if (log) {
        server.use(function(req, res, next) {
            console.log(req.url);
            next();
        });
    }

    server.use(express.static(rootPath + "/"));

    if (handler) {
        server.use(handler);
    } else {
        server.use(useStaticFile);
    }

    return server;

    function useStaticFile(req, res) {
        res.sendFile(path.join(rootPath, indexPath));
    }
}

export function createAppServerAsync(webpackConfig, log = false) {
    let { rootPath, indexPath } = getServerConfig(webpackConfig);
    return createAppHandlerAsync(webpackConfig)
        .then(appHandler => createServer(rootPath, indexPath, appHandler, log))
}

export function runServer(server, host, port, shouldOpen = false) {
    server.listen(port, () => {
        console.log(`Server listening on http://${host}:${port}`);
        if (shouldOpen) {
            let open = require("open");
            open(`http://${host}:${port}/`);
        }
    });
}

export function getWebpackStats(webpackConfig) {
    let path = webpackConfig.app.artifactConfig.webpackStatsPath;
    return utils.getFromJsonFile(path);
}

export function getHtmlConfig(webpackConfig) {
    let path = webpackConfig.app.artifactConfig.htmlConfigPath;
    return utils.getFromJsonFile(path);
}

export function getServerHtmlConfig(webpackConfig) {
    let htmlConfig = getHtmlConfig(webpackConfig);
    let webpackStats = getWebpackStats(webpackConfig);

    let publicPath = webpackConfig.devServer.publicPath;
    let addendum = publicPath.endsWith("/") ? publicPath : publicPath + "/";

    let webpackJs = [].concat(webpackStats.assetsByChunkName.main).filter(x => x.endsWith(".js")).map(x => addendum + x);
    let webpackCss = [].concat(webpackStats.assetsByChunkName.main).filter(x => x.endsWith(".css")).map(x => addendum + x);

    htmlConfig.js = htmlConfig.js.concat(webpackJs);
    htmlConfig.css = htmlConfig.css.concat(webpackCss);

    return htmlConfig;
}

export function getContextManagerFactory(webpackConfig) {
    const task = Promise.defer();
    webpackRequire(webpackConfig, require.resolve("../src/modules/core/ContextManager.ts"), (err, factory) => {
        if (err) { task.reject(err); return; }
        try {
            const cmFactory = factory().ContextManagerFactory;
            task.resolve(cmFactory);
        } catch (err) { task.reject(err); }
    });
    return task.promise;
}