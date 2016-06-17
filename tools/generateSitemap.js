import sitemap from "sitemap";
import utils from "./utils";
import configConstantsFactory from "../configConstants";
import path from "path";
import fs from "fs-extra-promise";
import chalk from "chalk";

function runAsync() {
    let { Paths, ArtifactConfig } = configConstantsFactory();
    let resolve = utils.createResolverForPath(Paths.dir);
    let artifactResolve = utils.createResolverForPath(resolve(Paths.artifactDirRelativeName));

    let routesPath = artifactResolve(ArtifactConfig.routesFileName);
    let routes = utils.getFromJsonFile(routesPath);

    let ext = ".xml";
    let sitemapPaths = {
        dir: resolve("./static/sitemaps"),
        index: resolve("./static/sitemap" + ext),
    }
    
    let mainOpts = {
        hostname: 'https://www.prasannavl.com',
        name: "core",
        urls: routes
            .filter(x => !x.routeTypeCode)
            .map(routeToSitemapFilter)
    };

    let contentOpts = {
        hostname: 'https://www.prasannavl.com',
        name: "content",
        urls: routes
            .filter(x => x.routeTypeCode && x.routeTypeCode === 1)
            .map(routeToSitemapFilter)
    };

    const opts = [mainOpts, contentOpts];

    return fs.ensureDirAsync(sitemapPaths.dir)
        .then(() => {
            let tasks = opts.map(x => {
                console.log(chalk.cyan("generating sitemaps.."));
                let sm = sitemap.createSitemap(x);
                sm.toXML(function (err, xml) {
                    if (err) throw err;
                    return fs.writeFileAsync(path.join(sitemapPaths.dir, x.name + ext), xml,
                        { encoding: "utf-8", flag: "w+" });
                });
            });
            return Promise.all(tasks);
        }).then(() => {
            console.log(chalk.cyan("generating sitemap index.."));
            createSitemapIndex(sitemapPaths.index, opts);
        });
}

function routeToSitemapFilter(routeObject) {
    if (typeof (routeObject) === "object") {
        return { url: routeObject.route, ...routeObject };
    } else {
        return { url: routeObject };
    }
}

function createSitemapIndex(indexFilePath, opts) {
    
}

runAsync();