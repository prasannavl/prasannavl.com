/* eslint-disable no-console */
import chalk from "chalk";
import * as path from "path";
import copyDir from "copy-dir";
import * as fs from "fs";

class Utils {

    hasCommandLineArg(str) {
        return process.argv.some(x => x === "--" + str);
    }
        
    getIsProduction() {
        return process.env.PRODUCTION || process.env.NODE_ENV === "production" || this.hasCommandLineArg("production");
    }

    initEnvironment(isProduction) {
        if (isProduction) {
            process.env["NODE_ENV"] = "production";
        } else {
            if (this.getNpmLifecycleEvent() === "dev") {
                // react-hmre is configured to run only under the interactive-dev session. 
                process.env["NODE_ENV"] = "interactive-dev";
            } else {
                process.env["NODE_ENV"] = "development";
            }
        }
    }
    
    shouldInlineLibs() {
       return this.hasCommandLineArg("inline-libs");
    }

    getNpmLifecycleEvent() {
        return process.env.npm_lifecycle_event;
    }
    
    ensureDirectoryExists(path) {
        if (!fs.existsSync(path)) fs.mkdirSync(path);
    }

    getFromJsonFile(path) {
        return JSON.parse(fs.readFileSync(path), "utf-8");
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
        if (fs.existsSync(src)) {
            process.stdout.write(chalk.yellow("Copying " + assetDisplayName + ".."));
            copyDir.sync(src, dest);
            process.stdout.write(" Done." + require("os").EOL);
        }
    }
}

export default new Utils();
