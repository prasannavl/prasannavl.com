const dataGen = require("./generate-data");
const routesGen = require("./generate-routes");

async function runAsync() {
    await dataGen.runAsync();
    await routesGen.runAsync();
}

runAsync();
