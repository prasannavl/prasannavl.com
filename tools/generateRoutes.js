import path from "path"; 
import configConstantsFactory from "../configConstants";
import utils from "./utils";
import fs from "fs";

let { Paths, ArtifactConfig } = configConstantsFactory();

function getRoutes() {
	let routes = [
		{ route: "/", changefreq: "weekly", priority: 1 },
		{ route: "/overview", changefreq: "daily", priority: 0.7 }, 
		{ route: "/archives", changefreq: "daily", priority: 0.9 }, 
		{ route: "/about", changefreq: "daily", priority: 0.8 }, 
		{ route: "/projects", changefreq: "daily", priority: 0.9 },
		{ route: "/404.html", file: "/404.html", priority: 0.2 },
    ];
    
	routes = routes.concat(getContentRoutes());
	return routes;
}

function getContentRoutes() {
	let staticIndexPath = path.join(Paths.dir, 
		Paths.generatedContentIndexesDirRelativeName,
		"all.json");
	let data = JSON.parse(fs.readFileSync(staticIndexPath, "utf-8"));
	return data.map(x => { return { route: "/" + x.url, routeTypeCode: 1 } });
}

function getRoutesFileName() {
	let routeArtifactsPath = path.join(Paths.dir, Paths.artifactDirRelativeName, ArtifactConfig.routesFileName);
	return routeArtifactsPath;	
}

function generateRoutesFile(routes, filePath) {
	console.log("Routes: ");
	routes.forEach(x => console.log(x));
	console.log();
	utils.writeToFileAsJson(filePath, routes);
}

function run() {
	generateRoutesFile(getRoutes(), getRoutesFileName());
}

run();
