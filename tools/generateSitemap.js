import sitemap from "sitemap";
import utils from "./utils";
import configConstantsFactory from "../configConstants";


function run() {
    let { Paths, ArtifactConfig } = configConstantsFactory();
    let resolve = utils.createResolverForPath(Paths.dir);
    let artifactResolve = utils.createResolverForPath(resolve(Paths.artifactDirRelativeName));

    let routesPath = artifactResolve(ArtifactConfig.routesFileName);
    let routes = utils.getFromJsonFile(routesPath);

    let ext = ".xml";
    let SitemapPaths = {
        dir: resolve("./static/sitemaps"),
        index: resolve("./static/sitemap" + ext),
    }
    
    let mainOpts = {
        hostname: 'https://www.prasannavl.com',
        filename: "core",
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

    [mainOpts, contentOpts].forEach(x => {
        let sm = sitemap.createSitemap(x);
        sm.toXML(function (err, xml) {
            if (err) throw err;
        });
    });
}

function routeToSitemapFilter(routeObject) {
    if (typeof (routeObject) === "object") {
        return { url: routeObject.route, ...routeObject };
    } else {
        return { url: routeObject };
    }
}

run();