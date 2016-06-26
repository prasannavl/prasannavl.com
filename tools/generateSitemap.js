import sitemap from "sitemap";
import utils from "./utils";
import configConstantsFactory from "../configConstants";
import path from "path";
import fs from "fs-extra-promise";
import chalk from "chalk";

function runAsync() {
    let { Paths, ArtifactConfig } = configConstantsFactory();
    let resolve = utils.createResolverForPath(Paths.dir);
    let outputResolve = utils.createResolverForPath(resolve(Paths.outputDirRelativeName));
    let artifactResolve = utils.createResolverForPath(resolve(Paths.artifactDirRelativeName));

    let routesPath = artifactResolve(ArtifactConfig.routesFileName);
    let routes = utils.getFromJsonFile(routesPath);

    let ext = ".xml";
    let outputDirName = "sitemaps";
    let indexPathName = "sitemap";

    let sitemapPaths = {
        dir: outputResolve("./" + outputDirName),
        index: outputResolve("./" + indexPathName + ext),
    }
    let hostname = "http://www.prasannavl.com";
    
    let mainOpts = {
        hostname,
        name: "core",
        urls: routes
            .filter(x => !x.routeTypeCode)
            .map(routeToSitemapFilter)
    };

    let contentOpts = {
        hostname,
        name: "content",
        urls: routes
            .filter(x => x.routeTypeCode && x.routeTypeCode === 1)
            .map(routeToSitemapFilter)
    };

    const opts = [mainOpts, contentOpts];

    return fs.ensureDirAsync(sitemapPaths.dir)
        .then(() => {
            console.log(chalk.cyan("generating sitemaps.."));
            let tasks = opts.map(x => {
                let sm = sitemap.createSitemap(x);
                return new Promise((resolve, reject) => {
                    sm.toXML(function (err, xml) {
                        if (err) throw err;
                        let resName = x.name + ext;
                        let p = path.join(sitemapPaths.dir, resName);
                        return fs.writeFileAsync(p, xml,
                            { encoding: "utf-8", flag: "w+" })
                            .catch(reject)
                            .then(() => resolve({
                                name: outputDirName + "/" + resName,
                                lastModifiedDate: new Date(),
                                opts: x
                            }));
                    });
                });
            });
            return Promise.all(tasks);
        }).then(res => {
            console.log(chalk.cyan("generating sitemap index.."));
            return createSitemapIndexAsync(sitemapPaths.index, res);
        });
}

function routeToSitemapFilter(routeObject) {
    if (typeof (routeObject) === "object") {
        return { url: routeObject.route, ...routeObject };
    } else {
        return { url: routeObject };
    }
}

function createSitemapIndexAsync(indexFilePath, indexes) {
    let eol = require("os").EOL;
    let xmlPrologue = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` + eol;
    let xmlEpilogue = eol + `</sitemapindex>`;
    let items = [];
    indexes.forEach(x => {
        let name = x.opts.hostname + "/" + x.name;
        let time = x.lastModifiedDate.toISOString();
        items.push(`<sitemap><loc>${name}</loc><lastmod>${time}</lastmod></sitemap>`);
    });
    let data = xmlPrologue + items.join(eol) + xmlEpilogue;
    return fs.writeFileAsync(indexFilePath, data, { encoding: "utf-8", flag: "w+" });
}

runAsync();