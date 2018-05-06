var RSS = require('rss');
const fs = require("fs-extra");
const path = require("path");
const _ = require("lodash");

const { consoleOut, writeFile, getPosts } = require("./utils");
const config = require("./config");

async function runAsync() {
    let feed = await getFeed();
    await writeFile("rss feed", config.RSS_PATH, feed.xml());
}

async function getFeed() {
    let date = new Date();
    let posts = await fs.readJSON(config.DATA_DIR_PATH + "/all.json");

    let site = "https://www.prasannavl.com";

    var feed = new RSS({
        title: 'Prasanna V. Loganathar',
        description: "Prasanna's Weblog",
        feed_url: site + "/rss.xml",
        site_url: site,
        image_url: site + "/icons/mstile-144x144.png",
        copyright: date.getFullYear() + " Prasanna V. Loganathar",
        language: 'en',
        pubDate: date.toISOString(),
    });

    _(posts).take(20).forEach(x => {
        feed.item({
            title: x.title,
            description: x.description ||
                (x.note ? "Note published on " : "Blog article published on ") + new Date(x.date).toUTCString(),
            url: site + x.url,
            date: x.date
        });
    });

    return feed;
}

if (require.main === module) {
    runAsync();
}

module.exports = {
    runAsync,
    getFeed,
}