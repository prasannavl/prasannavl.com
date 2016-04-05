import path from "path"; 
import configConstantsFactory from "../configConstants";
import utils from "./utils";
import fs from "fs";

let { Paths, ArtifactConfig } = configConstantsFactory();

function getRoutes() {
	let routes = [
		"/",
		{ route: "/404.html", file: "/404.html" },
		"/overview",
		"/about",
		"/archives",
		"/feedback",
    ];
    
	routes = routes.concat(getContentRoutes());
	return routes;
}

function getContentRoutes() {
	let staticIndexPath = path.join(Paths.dir, 
		Paths.generatedContentIndexesDirRelativeName,
		"all.json");
	let data = JSON.parse(fs.readFileSync(staticIndexPath, "utf-8"));
	return data.map(x => "/" + x.url);
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
