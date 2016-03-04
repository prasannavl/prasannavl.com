import utils from "./utils";
import * as path from "path";
import fs from "fs";
import chalk from "chalk";
import request from "request";
import mkdirp from "mkdirp";
import { ARTIFACTS_PATH, ROUTES_FILENAME, OUTPUT_PATH, DEVSERVER_PORT, DEVSERVER_HOST, DEVSERVER_PUBLIC_PATH } from "../config";
import { listen } from "./server";

console.log("Generating pages..");

let routeArtifactPath = path.join(ARTIFACTS_PATH, ROUTES_FILENAME);
let routes = utils.getFromJsonFile(routeArtifactPath);

if (routes.length > 0) {
    let root = routes[0];
    
    let appListener;
    let endListen = function () {
        if (appListener) appListener.close();
        console.log(chalk.green("Done."));
    };
    
    let listeners = 0;
    let startOne = function () { listeners++; }
    let doneOne = function () {
        listeners--;
        if (listeners === 0) endListen();
    }
    
    appListener = listen(() => {
        generate(root, () => {
            if (routes.length === 1) { endListen(); return; }
            routes.forEach(x => {
                if (x != root) {
                    startOne();
                    generate(x, () => doneOne());
                }
            });
        });
    });
}

function generate(p, cb) {
    let innerPath = p.endsWith("/") ? p + "index.html" : p + "/index.html";

    let url = `http://${DEVSERVER_HOST}:${DEVSERVER_PORT}${DEVSERVER_PUBLIC_PATH}${p}`.trim("/");
    let dest = path.join(OUTPUT_PATH, innerPath);
    console.log(p + " => " + innerPath);

    function writeResult(filePath, content) {
        fs.writeFile(filePath, content, err => {
            if (err) throw err;
        });
    }
    
    function end() {
        if (cb) cb();
    }

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let dir = path.dirname(dest);
            if (!fs.existsSync(dir)) {
                mkdirp(dir, () => {
                    writeResult(dest, body);
                    end();
                });
                return;
            }
            writeResult(dest, body);
            end();            
        }
        else {
            console.log(chalk.red(`Code: ${ response ? response.statusCode : "none"}, ${error}`));
            end();            
        }
    });
}