const fs = require("fs-extra");
const chalk = require("chalk");
const path = require("path");
const glob = require("glob");

async function writeFile(notificationName, destPath, data) {
    try {
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeFile(destPath, data, { flag: "w+", encoding: "utf-8" });
        consoleOut(`${notificationName} => ${destPath}`);
    } catch (err) {
        consoleOut(`${notificationName} => ${err}`);
    }
}

function consoleOut(str) {
    console.log(chalk.gray("data-importer: ") + str);
}

async function getPosts() {
    let postsPath = "../src/posts/";
    return new Promise((resolve, reject) => {
        glob(postsPath + "**/*.jsx", { cwd: __dirname }, (err, files) => {
            if (err) reject(err);
            let p = [];
            files.map(x => {
                fs.readFile(path.join(__dirname, x), (err, data) => {
                    if (err) reject(err);
                    let meta;
                    try {
                        meta = extractMetadata(data);
                    } catch (err) {
                        reject(err);
                    }
                    if (!meta) reject("unable to get metadata for file: " + x);
                    p.push(Object.assign({}, meta,
                        { url: "/" + x.slice(postsPath.length, x.length - 4) + "/" }));
                    if (p.length === files.length) {
                        resolve(p);
                    }
                });
            });
        });
    });
}

function extractMetadata(data) {
    let res = /const *?meta *?= *?\{[^]*?^\s*?\}\s*?$/m.exec(data);
    eval("function _getMeta() { " + res + ";return meta; }");
    return _getMeta();
}

module.exports = { writeFile, consoleOut, getPosts };