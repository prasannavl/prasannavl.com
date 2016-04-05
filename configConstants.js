import utils from "./tools/utils";
import _ from "lodash";

const HtmlConfig = {
    templatePath: "./src/components/Html",
    description: "Prasanna V. Loganathar's Weblog",
    titleTemplate: "%s | Prasanna V. Loganthar",
    titleOnEmpty: "Prasanna V. Loganathar",
    canonical: "",
};

const Paths = {
    dir: __dirname,
    contextDirRelativeName: "./src",
    outputDirRelativeName: "./build",
    staticDirRelativeName: "./static",
    artifactDirRelativeName: "./artifacts",
    serverRenderDirRelativeName: "./artifacts/server",
    htmlConfigFileRelativeName: "./htmlConfig.json",
    globalStyleFileRelativeName: "./src/styles/global.scss",
    generatedContentDirRelativeName: "./static/content",
    generatedContentIndexesDirRelativeName: "./static/content/indexes",
};

const OutputPatterns = {
    jsFileName: "js/[name].[hash].js",
    jsChunkFileName: "js/[name].[chunkhash].js",
    cssFileName: "css/[name].[contenthash].css",
    imageFileName: "images/[hash].[ext]",
};

const ArtifactConfig = {
    htmlConfigFileName: "htmlConfig.json",
    webpackStatsFileName: "stats.json",
    routesFileName: "routes.json",
    webpackBuiltConfigFileName: "webpackBuildConfig.json",
    dataTitleServiceFileName: "titleServiceData.json",
};

const ServerConfig = {
    publicPath: "/",
    host: process.env.HOST || "localhost",
    port: process.env.PORT || "8000",
    indexPath: "/index.html",
};

const ExternalLibs = [
    ["react", "https://fb.me/react-with-addons-0.14.7.js", "React"],
    ["react-dom", "https://fb.me/react-dom-0.14.7.js", "ReactDOM"],
];

const DefaultOptionsFactory = () => {
    return {
        isProduction: utils.getIsProduction(),
        //shouldInlineLibs: utils.shouldInlineLibs(),
        shouldInlineLibs: true,
        isServerRenderer: false,
    }
};

function factory() {
    return _.cloneDeep({
        Paths,
        OutputPatterns,
        ArtifactConfig,
        ServerConfig,
        ExternalLibs,
        HtmlConfig,
        DefaultOptions: DefaultOptionsFactory()
    });
}

export default factory;