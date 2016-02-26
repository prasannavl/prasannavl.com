import * as path from "path"; 
import { ARTIFACTS_PATH, ROUTES_FILENAME } from "../config";
import utils from "./utils";

let routes = ["/"];

let routeArtifactsPath = path.join(ARTIFACTS_PATH, ROUTES_FILENAME);
console.log("Routes: ");
routes.forEach(x => console.log(x));
console.log();
utils.writeToFileAsJson(routeArtifactsPath, routes);