"use strict";
/* eslint-disable no-console */

import chalk from "chalk";
import path from "path";
import copyDir from "copy-dir";
import fs from "fs";

class Utils {

    getIsProduction() {
        var npmEvent = this.getNpmLifecycleEvent();
        if (npmEvent && npmEvent.toLowerCase().endsWith(":p")) return true;
        return false;
    }

    initEnvironment(isProduction) {
        if (isProduction) {
            process.env["NODE_ENV"] = "production";
        } else {
            if (this.getNpmLifecycleEvent() === "dev") {
                // react-hmre is configured to run only under the interactive-dev session. 
                process.env["NODE_ENV"] = "interactive-dev";
            }
        }
    }

    getNpmLifecycleEvent() {
        return process.env.npm_lifecycle_event;
    }
    
    ensureDirectoryExists(path) {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
    }

    getFromJsonFile(path) {
        return JSON.parse(fs.readFileSync(path));
    }

    writeToFileAsJson(path, obj, flag = "w+") {
        fs.writeFile(path, JSON.stringify(obj), { flag });
    }

    createResolverForPath(pathRoot) {
        var resolve = src => {
            return path.resolve(path.join(pathRoot, src));
        };
        return resolve;
    }

    escapeRegExp(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }

    copyAssets(src, dest, assetDisplayName = "assets") {
        process.stdout.write(chalk.yellow("Copying " + assetDisplayName + ".."));
        copyDir.sync(src, dest);
        process.stdout.write("done" + require("os").EOL);
    }
}

export default new Utils();
