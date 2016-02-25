/* eslint-disable no-console */

import chalk from "chalk";
import * as webpack from "webpack";
import utils from "./utils";
import * as path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { HtmlRenderer } from "./app/HtmlRenderer";

class WebpackUtils {

    constructor() {
        this.logItems = [];
    }

    checkIsProduction(config) {
        return config.app.isProduction;
    }

    run(config, artifactsPath, statsFileName, staticAssetsPath, htmlConfigPath, htmlConfigArtifactPath) {

        let isProduction = this.checkIsProduction(config);
        utils.initEnvironment(isProduction);

        if (isProduction)
            console.log(chalk.cyan("Mode: Production"));
        else
            console.log(chalk.cyan("Mode: Development"));

        utils.ensureDirectoryExists(artifactsPath);
        console.log();

        if (this.logItems.length > 0) {
            this.logItems.forEach(x => console.log(x));
            console.log();
        }

        let htmlConfig = utils.getFromJsonFile(htmlConfigPath);
        this.updateHtmlConfigForExternals(htmlConfig, config.app.externals);

        if (!isProduction) {
            let htmlPlugin = new HtmlWebpackPlugin({
                fileName: "index.html",
                templateContent: HtmlRenderer.render(htmlConfig),
                inject: "head",
                minify: isProduction ? config.htmlMinifyOpts : false,
            });
            config.plugins.push(htmlPlugin);
        }

        let statsPath = path.join(artifactsPath, statsFileName)
        config.plugins.push(this.getStatsPlugin(statsPath));
        
        utils.writeToFileAsJson(htmlConfigArtifactPath, htmlConfig);

        utils.copyAssets(staticAssetsPath, config.output.path);
        console.log();
        return config;
    }
    
    getStatsPlugin(statsPath) {
        return function () {
            this.plugin("done", function (stats) {
                utils.writeToFileAsJson(statsPath, stats.toJson({ chunkModules: true, source: false, cached: false, reasons: false }));
            });
        }
    }

    updateHtmlConfigForExternals(config, externals) {
        config.js = [...config.js, ...externals.filter(x => x.endsWith(".js"))];
        config.css = [...config.css, ...externals.filter(x => x.endsWith(".css"))];
    }

    createConfiguration(config, devConfig, productionConfig) {
        if (this.checkIsProduction(config)) {
            config = Object.assign(config, productionConfig);
            if (!config.app.shouldInlineLibs) {
                config.app.externalLibs.forEach(x => {
                    let moduleName = x[0];
                    let externalAddress = x[1];
                    let importName = x[2] || x[0];
                    let res = this.addExternalDependency(config, moduleName, externalAddress, importName);
                    if (res) this.logItems.push(res);
                });
            }
        } else {
            config = Object.assign(config, devConfig);
        }
        return config;
    }

    applyPlugins(config, commonPlugins, devPlugins, productionPlugins) {
        config.plugins.push(...commonPlugins);
        if (this.checkIsProduction(config)) {
            config.plugins.push(...productionPlugins);
        } else {
            config.plugins.push(...devPlugins);
        }
    }


    addExternalDependency(config, moduleName, externalAddress, importName) {
        let states = [];

        function addToHtmlExternals(externalAddress) {
            states.push("external url: " + externalAddress);
            config.app.externals.push(externalAddress);
        }

        function addToWebpackExternals(moduleName, importName) {
            states.push("external import: " + importName)
            config.externals[moduleName] = importName;
        }

        function addToIgnore(moduleName) {
            states.push("ignoring internal: " + moduleName);
            config.plugins.push(
                new webpack.IgnorePlugin(new RegExp(utils.escapeRegExp(moduleName)))
                );
        }

        if (externalAddress) {
            addToHtmlExternals(externalAddress);
            if (externalAddress.endsWith(".css")) {
                addToIgnore(moduleName);
            } else {
                addToWebpackExternals(moduleName, importName);
            }
        }

        if (states.length > 0)
            return chalk.yellow(moduleName + ":") + "\r\n" + chalk.cyan("\t" + states.join("\r\n\t"));

        return false;
    }
}

export default new WebpackUtils();