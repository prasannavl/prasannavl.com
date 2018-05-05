const fetch = require("isomorphic-unfetch");
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

const { consoleOut, writeFile, getPosts } = require("./utils");
const getIndexers = require("./indexers");
const config = require("./config");

function runAsync() {
    const dataDir = config.DATA_DIR_PATH;
    let importers = [projectsList, ...getPostIndexers()];
    return Promise.all(importers.map(async x => {
        let desc = await x();
        return writeFile(desc.name, path.join(dataDir, desc.name + ".json"), JSON.stringify(desc.data));
    })).then(x => consoleOut("done")).catch(err => consoleOut("error: " + err));
}

async function projectsList() {
    consoleOut("projects..");

    const projectsData = await fetch('https://api.github.com/search/repositories?q=user:prasannavl&fork:false');
    const json = await projectsData.json();

    const projects = _(json.items)
        .map(x => { return { name: x.name, url: x.html_url, stars: x.stargazers_count, description: x.description } })
        .sortBy(x => x.stars)
        .takeRight(5)
        .reverse()
        .value();

    return { data: projects, name: "projects" };
}

function getPostIndexers() {
    consoleOut("post indexes..");
    let indexers = getIndexers();
    let posts = getPosts();
    return indexers.map(fn => async () => fn(await posts));
}

if (require.main === module) {
    runAsync();
}

module.exports = {
    runAsync,
    projectsList,
    getPostIndexers,
}

