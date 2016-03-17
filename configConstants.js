import utils from "./tools/utils";

export const HtmlConfig = {
    templatePath: "./src/components/Html",
    description: "Prasanna V. Loganathar's Weblog",
    titleTemplate: "%s | Prasanna V. Loganthar",
    titleOnEmpty: "Prasanna V. Loganathar",
    canonical: "https://www.prasannavl.com",
};

export const Paths = {
    dir: __dirname,
    contextDirRelativeName: "./src",
    outputDirRelativeName: "./build",
    staticDirRelativeName: "./static",
    artifactDirRelativeName: "./artifacts",
    htmlConfigFileRelativeName: "./htmlConfig.json",
    globalStyleFileRelativeName: "./src/styles/global.scss",
};

export const OutputPatterns = {
    jsFileName: "js/[name].[hash].js",
    jsChunkFileName: "js/[name].[chunkhash].js",
    cssFileName: "css/[name].[contenthash].css",
    imageFileName: "images/[hash].[ext]",
};

export const ArtifactConfig = {
    htmlConfigFileName: "htmlConfig.json",
    webpackStatsFileName: "stats.json",
    routesFileName: "routes.json",
    webpackBuiltConfigFileName: "webpackBuildConfig.json",
    dataTitleServiceFileName: "titleServiceData.json",
};

export const ServerConfig = {
    publicPath: "/",
    host: process.env.HOST || "localhost",
    port: process.env.PORT || "8000",
    indexPath: "/index.html",
};

export const ExternalLibs = [
    ["react", "https://fb.me/react-with-addons-0.14.7.js", "React"],
    ["react-dom", "https://fb.me/react-dom-0.14.7.js", "ReactDOM"],
];

export const DefaultOptions = {
    isProduction: utils.getIsProduction(),
    shouldInlineLibs: utils.shouldInlineLibs(),
    isServerRenderer: false,
};

export default {
    Paths,
    OutputPatterns,
    ArtifactConfig,
    ServerConfig,
    ExternalLibs,
    HtmlConfig,
    DefaultOptions
};