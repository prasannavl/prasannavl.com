const url = require("url");
const { run } = require("react-snap");
const fs = require("fs-extra");
const path = require("path");

async function snap() {
    process.chdir(path.resolve(path.join(__dirname, "./../")));

    const dynamicProcessors = (snappy) => {
        return Promise.all[
            removeNonOriginScriptTags(snappy),
            deferScriptTags(snappy)
        ];
    }

    const staticProcessors = (snappy) => {
        return Promise.all[
            removeNonInlineScriptTags(snappy)
        ];
    }

    const processors = dynamicProcessors;

    run({
        publicPath: "/",
        skipThirdPartyRequests: true,
        preconnectThirdParty: false,
        puppeteerArgs: ["--no-sandbox"],
        preProcess: processors
    });
}

async function runAsync() {
    await snap();
    // workaround react-snap bug where the promise actually
    // gets resolved before it truly completes.
    process.once("beforeExit", () => {
        fs.unlink("./build/200.html");
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

const removeNonOriginScriptTags = ({ page }) => {
    return page.evaluate(() => {
        let origin = window.location.origin;
        Array.from(document.querySelectorAll("script"))
            .filter(node => node.src)
            .filter(node => !node.src.startsWith(origin))
            .forEach(ell => {
                ell.parentElement && ell.parentElement.removeChild(ell);
            });
    });
};

// This removes *only* the script tags with an `src` attribute - so that it's
// still possible to add some script in the file like Google Analytics, etc
// using direct `script` without the src attribute. 
const removeNonInlineScriptTags = ({ page }) => {
    return page.evaluate(() => {
        Array.from(document.querySelectorAll("script")).filter(node => node.src).forEach(ell => {
            ell.parentElement && ell.parentElement.removeChild(ell);
        });
    });
};

runAsync();