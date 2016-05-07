/* eslint-disable no-console */
import express from "express";
import compression from "compression";
import path from "path";
import AppRenderer from "./AppRenderer";
import Promise from "bluebird";
import utils from "./utils";
import webpack from "webpack";

const __DELAY__ = 0;

function getServerConfig(webpackConfig) {
    let rootPath = webpackConfig.output.path;
    let indexPath = webpackConfig.devServer.publicPath;
    return { rootPath, indexPath };
}

export function createAppHandlerAsync(webpackConfig, clientWebpackConfig = null) {
    return executeWebpackAsync(webpackConfig).then(execResult => {
        let { app, stats } = execResult;
        let htmlConfig = getServerHtmlConfig(clientWebpackConfig || webpackConfig);
        let contextManagerFactory = getContextManagerFactory(app, stats)
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

    if (__DELAY__) {
        const delay = __DELAY__;
        server.use((req, res, next) => {
            setTimeout(function (){
                next();
            }, delay);
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

export function createStaticServerAsync(webpackConfig, log = false) {
    let { rootPath, indexPath } = getServerConfig(webpackConfig);    
    return Promise.resolve(createServer(rootPath, indexPath, null, log));
}

export function createAppServerAsync(webpackConfig, clientWebpackConfig = null, log = false) {
    let { rootPath, indexPath } = getServerConfig(webpackConfig);
    return createAppHandlerAsync(webpackConfig, clientWebpackConfig)
        .then(appHandler => createServer(rootPath, indexPath, appHandler, log))
}

export function runServer(server, host, port, shouldOpen = false) {
    server.listen(port, () => {
        console.log(`Server listening on http://${host}:${port}`);
        if (shouldOpen) {
            let open = require("open");
            let hostAddress;
            if (host === "0.0.0.0") {
                hostAddress = "localhost";
            } else {
                hostAddress = host;
            }
            open(`http://${hostAddress}:${port}/`);            
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

export function executeWebpackAsync(webpackConfig) {
    let compiler = webpack(webpackConfig);
    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) { reject(err); return; }
            let parsedStats = stats.toJson(
                { chunkModules: true, source: false, cached: false, reasons: false });
            let mainModule = parsedStats.assetsByChunkName.main.filter(x => x.endsWith(".js"))[0];
            const webpackAppKey = "_webpack_app";
            let oldCache = global[webpackAppKey];
            require(path.join(path.join(webpackConfig.output.path, mainModule)));
            let app = global[webpackAppKey];
            global[webpackAppKey] = oldCache;
            return resolve({ app, stats: parsedStats });
        });
    });
}

export function getContextManagerFactory(app, stats) {
    let moduleName = "./src/modules/core/ContextManager.ts";
    let moduleId = stats.modules.find(x => x.name && x.name == moduleName).id;
    let moduleExports = app.getModuleLoader()(moduleId);
    return moduleExports.ContextManagerFactory;
}