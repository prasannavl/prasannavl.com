import webpack from "webpack";

import autoprefixer from "autoprefixer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import OpenBrowserPlugin from "open-browser-webpack-plugin";
import * as path from "path";
import fs from "fs";

import utils from "./tools/utils";
import webpackUtils from "./tools/webpackUtils";
import htmlRenderer from "./tools/htmlRenderer";
import { StatsWriterPlugin } from "webpack-stats-plugin";

let resolve = utils.createResolverForPath(__dirname);

// Core constants

export const IS_PRODUCTION = utils.getIsProduction();
utils.initEnvironment(IS_PRODUCTION);

export const CONTEXT_PATH = resolve("./src");
export const OUTPUT_PATH = resolve("./build");
export const STATIC_PATH = resolve("./static");

export const OUTPUT_FILENAME_PATTERN = "js/[name].[hash].js";
export const OUTPUT_CHUNK_FILENAME_PATTERN = "js/[name].[chunkhash].js";
export const OUTPUT_CSS_FILENAME_PATTERN = "css/[name].[contenthash].css";
export const OUTPUT_IMAGES_FILENAME_PATTERN = "images/[hash].[ext]";

export const ARTIFACTS_PATH = resolve("./artifacts");
export const HTML_CONFIG_FILE = resolve("./htmlConfig.json");
export const HTML_CONFIG_ARTIFACT_FILE = path.join(ARTIFACTS_PATH, path.basename(HTML_CONFIG_FILE));
export const WEBPACK_STATS_FILENAME = "stats.json";
const WEBPACK_STATS_OUTPUT_RELATIVE_PATH = path.join(path.relative(OUTPUT_PATH, ARTIFACTS_PATH), WEBPACK_STATS_FILENAME);

// Dev server constants

export const DEVSERVER_PUBLIC_PATH = "/";
export const DEVSERVER_CONTENT_BASE = "";
export const DEVSERVER_HOST = "localhost";
export const DEVSERVER_PORT = "8000";
export const DEVSERVER_INDEX_PATH_RELATIVE = "/index.html";

// Libraries 

const EXTERNAL_LIBS = [
    ["react", "https://fb.me/react-0.14.7.min.js", "React"],
    ["react-dom", "https://fb.me/react-dom-0.14.7.min.js", "ReactDOM"],
    ["noramlize.css", "https://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.min.css"],
    ["react-router", "https://npmcdn.com/react-router/umd/ReactRouter.min.js", "ReactRouter"],
];

// Core configuration

// App specific. Everthing that's used by webpackUtil that's not webpack's or it's plugin specific config is here.
let app = {
    isProduction: IS_PRODUCTION,
    externals: [], // This is used by the util to populate used external libs that are to be added to index template.
    externalLibs: EXTERNAL_LIBS,
};

let config = {
    app,
    context: CONTEXT_PATH,
    entry: {
        main: "./index.js"
    },
    output: {
        filename: OUTPUT_FILENAME_PATTERN,
        chunkFilename: OUTPUT_CHUNK_FILENAME_PATTERN,
        path: OUTPUT_PATH,
        pathInfo: !IS_PRODUCTION
    },
    resolve: {
        alias: {},
        extension: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
    },
    module: {
        noParse: [],
        loaders: [{
            test: /\.js[x]?$/i,
            loader: "babel",
            exclude: /node_modules/
        }, {
                test: /\.json$/i,
                loader: "json"
            }, {
                test: /\.css$/i,
                loader: "style!css!postcss"
            }, {
                test: /\.scss$/i,
                loaders: ["style", "css?-autoprefixer", "postcss", "sass"]
            }, {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    "url?limit=8192&name=" + OUTPUT_IMAGES_FILENAME_PATTERN,
                    "image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: '65-90', speed: 4}}"
                ]
            }, {
                test: /\.ico$/i,
                loader: "file?name=" + OUTPUT_IMAGES_FILENAME_PATTERN
            }]
    },
    plugins: [],
    externals: {},
    watchOptions: {
        aggregateTimeout: 100
    },
    debug: !IS_PRODUCTION,
    devtool: IS_PRODUCTION ? "source-map" : "cheap-module-eval-source-map",
    devServer: {
        contentBase: DEVSERVER_CONTENT_BASE,
        host: DEVSERVER_HOST,
        port: DEVSERVER_PORT,
        historyApiFallback: {
            index: DEVSERVER_INDEX_PATH_RELATIVE
        },
        quiet: false,
        noInfo: false,
        devtool: "cheap-module-eval-source-map",
        publicPath: DEVSERVER_PUBLIC_PATH,
        hot: true,
        lazy: false,
        stats: {
            colors: true
        }
    },
    postcss: () => {
        return [autoprefixer];
    }
};

// Conditional configurations

let devConfig = {};

let productionConfig = {
    htmlMinifyOpts: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: false,
        removeRedundantAttributes: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        useShortDoctype: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        minifyJS: true,
        minifyCSS: true
    },
    uglifyJsOpts: {
        comments: !IS_PRODUCTION,
        mangle: IS_PRODUCTION,
        compressor: {
            warnings: false
        },
        "screw-ie8": true
    }
};

// Apply configurations

config = webpackUtils.createConfiguration(config, devConfig, productionConfig);

let htmlConfig = JSON.parse(fs.readFileSync(HTML_CONFIG_FILE));
if (!fs.existsSync(ARTIFACTS_PATH)) fs.mkdirSync(ARTIFACTS_PATH);
app.externals.filter(x => x.endsWith(".js")).forEach(x => htmlConfig.js.push(x));
app.externals.filter(x => x.endsWith(".css")).forEach(x => htmlConfig.css.push(x));
fs.writeFile(HTML_CONFIG_ARTIFACT_FILE, JSON.stringify(htmlConfig), { flag: "w+"});

// Common plugins

let commonPlugins = [
    new webpack.DefinePlugin({
        "__DEV__": !IS_PRODUCTION
    }),
    new HtmlWebpackPlugin({
        fileName: "index.html",
        templateContent: htmlRenderer.render(htmlConfig),
        inject: "head",
        minify: IS_PRODUCTION ? productionConfig.htmlMinifyOpts : false,
    }),
    new StatsWriterPlugin({
        filename: WEBPACK_STATS_OUTPUT_RELATIVE_PATH
    })
];

// Conditional plugins

let devPlugins = [
    new webpack.NoErrorsPlugin(),
];

let productionPlugins = [
    new webpack.DefinePlugin({
        "process.env": {
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(productionConfig.uglifyJsOpts),
];

// Apply plugins

webpackUtils.applyPlugins(config, commonPlugins, devPlugins, productionPlugins);

// Post setup configurations
config.plugins.push(
    new OpenBrowserPlugin({
        url: `http://${DEVSERVER_HOST}:${DEVSERVER_PORT}`
    }),
    );

export function run() {
    return webpackUtils.run(config, STATIC_PATH);
}

export default config;