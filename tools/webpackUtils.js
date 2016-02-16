/* eslint-disable no-console */

import chalk from "chalk";
import webpack from "webpack";
import utils from "./utils";

class WebpackUtils {
    
    constructor() {
        this.logItems = [];
    }
    
    checkIsProduction(config)
    {
        return config.app.isProduction;
    }
    
    run(config, staticAssetsPath) {
        if (this.checkIsProduction(config))
            console.log(chalk.cyan("Mode: Production"));
        else
            console.log(chalk.cyan("Mode: Development"));

        console.log();

        if (this.logItems.length > 0) {
            this.logItems.forEach(x => console.log(x));
            console.log();
        }
        utils.copyAssets(staticAssetsPath, config.output.path);
        console.log();
        return config;
    }

    createConfiguration(config, devConfig, productionConfig) {
        if (this.checkIsProduction(config)) {
            config = Object.assign(config, productionConfig);
            config.app.externalLibs.forEach(x => {
                let moduleName = x[0];
                let externalAddress = x[1];
                let importName = x[2] || x[0];
                let res = this.addExternalDependency(config, moduleName, externalAddress, importName);
                if (res) this.logItems.push(res);
            });
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