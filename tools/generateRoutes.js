import path from "path"; 
import { Paths, ArtifactConfig } from "../configConstants";
import utils from "./utils";

function getRoutes() {
	let routes = ["/", "/overview", "/about", "/archives"];
	return routes;	
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
