import webpackRequire from "webpack-require";
import Promise from "bluebird";
import utils from "../utils";

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
    webpackRequire(webpackConfig, require.resolve("../../src/modules/core/ContextManager.ts"), (err, factory) => {
        if (err) { task.reject(err); return; }
        try {
            const cmFactory = factory().ContextManagerFactory;
            task.resolve(cmFactory);
        } catch (err) { task.reject(err); }
    });
    return task.promise;
}