import utils from "./utils";
import path from "path";
import fs from "fs";
import chalk from "chalk";
import request from "request";
import mkdirp from "mkdirp";
import http from "http";
import { Paths, ArtifactConfig, ServerConfig } from "../ConfigConstants";
import { getServerListenerFactoryAsync } from "./server";

// TODO: Switch to superagent
// TODO: Switch to promises

function runServerAsync(log = false) {
    return getServerListenerFactoryAsync(log)
        .then(runAppServer => runAppServer({ shouldOpen: false }))
        .catch(err => console.log(err.toString().replace("\\n", "\n")));
}

console.log("Generating pages..");

let resolve = utils.createResolverForPath(Paths.dir);
let artifactResolve = utils.createResolverForPath(resolve(Paths.artifactDirRelativeName));

let routesPath = artifactResolve(ArtifactConfig.routesFileName);
let routes = utils.getFromJsonFile(routesPath);

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
    
    runServerAsync().then(() => {
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

    let url = `http://${ServerConfig.host}:${ServerConfig.port}${ServerConfig.publicPath}${webPath}`.trim("/");
    let dest = path.join(resolve(Paths.outputDirRelativeName), innerPath);
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