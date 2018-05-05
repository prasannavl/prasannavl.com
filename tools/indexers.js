const _ = require("lodash");
const { consoleOut } = require("./utils");

function getIndexers() {
    return [ allIndexer, recentIndexer, featuredIndexer, archivesIndexer ];
}

module.exports = getIndexers;

function allIndexer(fileDataItems) {
    consoleOut("all..");

    let indexData = _.chain(fileDataItems)
        .sortBy(x => new Date(x.date))
        .reverse()
        .value();

    return { data: indexData, name: "all" };
}

function recentIndexer(fileDataItems) {
    consoleOut("recent..");

    let indexData = _.chain(fileDataItems)
        .map(x => _.omit(x, ["featured", "description"]))        
        .sortBy(x => new Date(x.date))
        .takeRight(5)
        .reverse()
        .value();

    return { data: indexData, name: "recent" };
}

function featuredIndexer(fileDataItems) {
    consoleOut("featured..");

    let indexData = _.chain(fileDataItems)
        .filter(x => x.featured)
        .map(x => _.omit(x, ["featured", "description"]))
        .sortBy(x => new Date(x.date))
        .takeRight(5)
        .reverse()
        .value();

    return { data: indexData, name: "featured" };
}

function archivesIndexer(fileDataItems) {
    consoleOut("archives..");

    let indexData = _.chain(fileDataItems)
        .map(x => _.omit(x, "description"))            
        .sortBy(x => new Date(x.date))
        .reverse()
        .groupBy(x => new Date(x.date).getFullYear())
        .toPairs()
        .reverse()
        .value();

    return { data: indexData, name: "archives" };
}

function tagListIndexer(fileDataItems) {
    consoleOut("taglist..");

    let indexData = _.chain(fileDataItems)
        .map(x => x.tags)
        .flatten()
        .uniq()
        .value();

    return { data: indexData, name: "taglist" };
}