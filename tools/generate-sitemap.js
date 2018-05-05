const sitemap = require("sitemap");
const fs = require("fs-extra");
const path = require("path");

const { consoleOut, writeFile } = require("./utils");
const config = require("./config");

async function runAsync() {
    let ext = ".xml";
    let outputDirName = "sitemaps";
    let indexPathName = "sitemap";

    let sitemapsRootPath = config.SITEMAPS_TARGET_DIR_PATH;
    let routesFilePath = config.ROUTES_FILE_PATH;

    let sitemapPaths = {
        dir: path.join(sitemapsRootPath, outputDirName),
        index: path.join(sitemapsRootPath, indexPathName + ext),
    }
    
    let hostname = "https://www.prasannavl.com";
    
    let routes = await fs.readJSON(routesFilePath);

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
    await fs.ensureDir(sitemapPaths.dir);
    consoleOut("generating sitemaps..");
    
    let tasks = opts.map(x => {
        let sm = sitemap.createSitemap(x);
        let task = new Promise((resolve, reject) => {
            sm.toXML(function (err, xml) {
                if (err) throw err;
                let resName = x.name + ext;
                let p = path.join(sitemapPaths.dir, resName);
                writeFile(x.name, p, xml)
                    .catch(reject)
                    .then(() => resolve({
                        name: outputDirName + "/" + resName,
                        lastModifiedDate: new Date(),
                        opts: x
                    }));
            });
        });
        return task;
    });
    let res = await Promise.all(tasks);
    consoleOut("generating sitemap index..");
    await createSitemapIndexAsync(sitemapPaths.index, res);
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
    return writeFile("sitemap-index", indexFilePath, data);
}

if (require.main === module) {
    runAsync();
}

module.exports = {
    runAsync
}