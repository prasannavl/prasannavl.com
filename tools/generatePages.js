import utils from "./utils";
import * as path from "path";
import fs from "fs";
import chalk from "chalk";
import request from "request";
import mkdirp from "mkdirp";
import { ARTIFACTS_PATH, ROUTES_FILENAME, OUTPUT_PATH, DEVSERVER_PORT, DEVSERVER_HOST, DEVSERVER_PUBLIC_PATH } from "../config";
import http from "http";
import { app } from "./server";

console.log("Generating pages..");

const port = process.env.PORT || DEVSERVER_PORT;

let routeArtifactPath = path.join(ARTIFACTS_PATH, ROUTES_FILENAME);
let routes = utils.getFromJsonFile(routeArtifactPath);

if (routes.length > 0) {
    let firstRequest = routes[0];
    
    let appListener;
    let endListen = function () {
        if (appListener) appListener.close();
        console.log(chalk.green("Done."));
        process.exit();
    };
    
    let listeners = 0;
    let startOne = function () { listeners++; }
    let doneOne = function () {
        listeners--;
        if (listeners === 0) endListen();
    }
    
    appListener = http.createServer(app).listen(port, () => {
        generate(firstRequest, (err) => {
            if (!(err === undefined || err === null) || routes.length === 1) { endListen(); return; }
            routes.forEach(x => {
                if (x != firstRequest) {
                    startOne();
                    generate(x, (err) => { if (err) { console.log(chalk.red(err)); } doneOne(); });
                }
            });
        });
    });
}

function generate(p, cb) {
    // Setup index.html as default
    let innerPath = p.endsWith("/") ? p + "index.html" : p + "/index.html";

    // Strip the first "/", if it exists.
    const webPath = (p.indexOf("/") === 0) ? p.substring(1) : p;

    let url = `http://${DEVSERVER_HOST}:${DEVSERVER_PORT}${DEVSERVER_PUBLIC_PATH}${webPath}`.trim("/");
    let dest = path.join(OUTPUT_PATH, innerPath);
    console.log(p + " => " + innerPath);

    function writeResult(filePath, content) {
        fs.writeFile(filePath, content, err => {
            end(err);
        });
    }
    
    function end(err) {
        if (cb) cb(err);
    }

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            let dir = path.dirname(dest);
            if (!fs.existsSync(dir)) {
                mkdirp(dir, () => {
                    writeResult(dest, body);
                });
                return;
            }
            writeResult(dest, body);
        }
        else {
            console.log(chalk.red(`Code: ${ response ? response.statusCode : "none"}, ${error}`));
            end(error);            
        }
    });
}