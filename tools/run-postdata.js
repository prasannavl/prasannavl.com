const routesGen = require("./generate-routes");
const sitemapGen = require("./generate-sitemap");
const rssGen = require("./generate-rss");

async function runAsync() {
    await routesGen.runAsync();
    await Promise.all([sitemapGen.runAsync(), rssGen.runAsync()]);
}

runAsync();
