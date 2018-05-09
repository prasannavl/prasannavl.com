const path = require("path");

function currentPath(relPath) {
    return path.resolve(path.join(__dirname, relPath))
}

module.exports = {
    DATA_DIR_PATH: currentPath("../src/data/"),
    ROUTES_FILE_PATH: currentPath("../src/data/routes.json"),
    SITEMAPS_TARGET_DIR_PATH: currentPath("../public/"),
    RSS_PATH: currentPath("../public/rss.xml")
}