const fs = require("fs-extra");
const path = require("path");

const { consoleOut, writeFile } = require("./utils");
const config = require("./config");

async function runAsync() {
	await generateRoutesFile(getRoutes(), config.ROUTES_FILE_PATH);
}

function getRoutes() {
	let routes = [
		{ route: "/", changefreq: "daily", priority: 1 }, 
		{ route: "/archives/", changefreq: "daily", priority: 0.9 }, 
		// { route: "/projects/", changefreq: "daily", priority: 0.9 },
    ];
	routes = routes.concat(getContentRoutes());
	return routes;
}

function getContentRoutes() {
	let staticIndexPath = path.join(config.DATA_DIR_PATH + "/all.json");
	let data = JSON.parse(fs.readFileSync(staticIndexPath, "utf-8"));
	return data.map(x => { return { route: x.url, routeTypeCode: 1 } });
}

function generateRoutesFile(routes, filePath) {
	return writeFile("routes", filePath, JSON.stringify(routes));
}

if (require.main === module) {
    runAsync();
}

module.exports = {
    runAsync,
    getRoutes,
    getContentRoutes,
}
