const url = require("url");
const { run } = require("react-snap");
const fs = require("fs-extra");
const path = require("path");

async function snap() {
    process.chdir(path.resolve(path.join(__dirname, "./../")));
    run({
        publicPath: "/",
        skipThirdPartyRequests: true,
        preconnectThirdParty: false,
        puppeteerArgs: ["--no-sandbox"],
        preProcess: (snappy) => {
            return removeScriptTagsWithSrcAttribute(snappy)
        },
    });
}

async function runAsync() {
    await snap();
    // workaround react-snap bug where the promise actually
    // gets resolved before it truly completes.
    process.once("beforeExit", () => {
        fs.unlink("./build/200.html");
        fs.unlink("./build/404.html");
    });
}

const deferScriptTags = ({ page }) => {
    return page.evaluate(() => {
        Array.from(document.querySelectorAll("script[src]")).forEach(x => {
            x.removeAttribute("async");
            x.setAttribute("defer", "true");
        });
    });
};

// This removes *only* the script tags with an `src` attribute - so that it's
// still possible to add some script in the file like Google Analytics, etc
// using direct `script` without the src attribute. 
const removeScriptTagsWithSrcAttribute = ({ page }) => {
    return page.evaluate(() => {
        Array.from(document.querySelectorAll("script")).filter(node => node.src).forEach(ell => {
            ell.parentElement && ell.parentElement.removeChild(ell);
        });
    });
};

runAsync();