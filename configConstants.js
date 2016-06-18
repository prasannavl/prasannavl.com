import utils from "./tools/utils";
import _ from "lodash";

const HtmlConfig = {
    templatePath: "./src/components/Html",
    description: "Prasanna's Weblog",
    titleTemplate: "%s | Prasanna V. Loganathar",
    titleOnEmpty: "Prasanna V. Loganathar",
    canonical: "",
    inlineScripts: [{
        placement: "body-start",
        content:  `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-MZ2DHR');`
    }]
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
    host: process.env.HOST || "0.0.0.0",
    port: process.env.PORT || "8000",
    indexPath: "/index.html",
};

const ExternalLibs = [
    // ["react", "https://fb.me/react-with-addons-0.14.7.js", "React"],
    // ["react-dom", "https://fb.me/react-dom-0.14.7.js", "ReactDOM"],
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