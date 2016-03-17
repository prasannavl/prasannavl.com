/* eslint-disable no-console */
import express from "express";
import compression from "compression";
import path from "path";
import AppRenderer from "./app/AppRenderer";
import { getServerHtmlConfig, getContextManagerFactory } from "./app/ConfigUtils";

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