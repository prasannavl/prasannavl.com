import utils from "./utils";
import path from "path";
import fs from "fs-extra-promise";
import chalk from "chalk";
import request from "superagent";
import configConstantsFactory from "../configConstants";
import { getServerListenerFactoryAsync } from "./server";

let { Paths, ArtifactConfig, ServerConfig } = configConstantsFactory();
// TODO: rewrite and switch to promises

function runServerAsync(log = false) {
    return getServerListenerFactoryAsync(log)
        .then(runAppServer => runAppServer({ shouldOpen: false }))
        .catch(err => {
            console.log(chalk.red(err.toString().replace("\\n", "\n")));
        });
}

console.log("Generating pages..");

let resolve = utils.createResolverForPath(Paths.dir);
let artifactResolve = utils.createResolverForPath(resolve(Paths.artifactDirRelativeName));

let routesPath = artifactResolve(ArtifactConfig.routesFileName);
let routes = utils.getFromJsonFile(routesPath);

let dontQuit = false;

if (routes.length > 0) {
    let firstRequest = routes[0];

    let appListener;
    let endListen = function () {
        if (!dontQuit) {
            if (appListener) appListener.close();
            console.log(chalk.green("Done."));
            process.exit();
        }
    };

    let listeners = 0;
    let startOne = function () { listeners++; }
    let doneOne = function () {
        listeners--;
        if (listeners === 0) endListen();
    }

    runServerAsync().then(() => {
        console.log("server ready");
        generate(firstRequest, (err) => {
            if (!(err === undefined || err === null) || routes.length === 1) {
                endListen();
                return;
            }
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
    let requestPath, filePath;
    
    function getFileName(contextPath) {
        return contextPath.endsWith("/") ? contextPath + "index.html" : contextPath + "/index.html"
    }

    if (typeof p === "object") {
        requestPath = p.route;
        filePath = getFileName(p.file || requestPath);
    } else {
        filePath = getFileName(p);
        requestPath = p;
    }
    // Strip the first "/", if it exists.
    const webPath = (requestPath.indexOf("/") === 0) ? requestPath.substring(1) : requestPath;
    const host = ServerConfig.host;
    let hostAddress;
    if (host === "0.0.0.0") {
        hostAddress = "localhost";
    } else {
        hostAddress = host;
    }
    let url = `http://${hostAddress}:${ServerConfig.port}${ServerConfig.publicPath}${webPath}`;
    let dest = path.join(resolve(Paths.outputDirRelativeName), filePath);
    console.log(p + " => " + filePath);

    function writeResult(filePath, content) {
        fs.writeFile(filePath, content, err => {
            end(err);
        });
    }

    function end(err) {
        if (cb) cb(err);
    }

    request
        .get(url)
        .buffer(true)
        .end(function (err, res) {
            if (!err && res.statusCode == 200) {
                let dir = path.dirname(dest);
                if (!fs.existsSync(dir)) {
                    fs.mkdirp(dir, () => {
                        writeResult(dest, res.text);
                    });
                    return;
                }
                writeResult(dest, res.text);
            }
            else {
                console.log(chalk.red(`Code: ${res ? res.statusCode : "none"}, ${err}`));
                end(err);
            }
        });
}