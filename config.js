import webpack from "webpack";

import autoprefixer from "autoprefixer";
import OpenBrowserPlugin from "open-browser-webpack-plugin";
import * as path from "path";

import utils from "./tools/utils";
import webpackUtils from "./tools/webpackUtils";
import ExtractTextPlugin from "extract-text-webpack-plugin";

let resolve = utils.createResolverForPath(__dirname);

// Core constants

export const IS_PRODUCTION = utils.getIsProduction();

export const CONTEXT_PATH = resolve("./src");
export const OUTPUT_PATH = resolve("./build");
export const STATIC_PATH = resolve("./static");

export const OUTPUT_FILENAME_PATTERN = "js/[name].[hash].js";
export const OUTPUT_CHUNK_FILENAME_PATTERN = "js/[name].[chunkhash].js";
export const OUTPUT_CSS_FILENAME_PATTERN = "css/[name].[contenthash].css";
export const OUTPUT_IMAGES_FILENAME_PATTERN = "images/[hash].[ext]";

export const HTML_CONFIG_PATH = resolve("./htmlConfig.json");

// Artifact constants

export const ARTIFACTS_PATH = resolve("./artifacts");
export const HTML_CONFIG_ARTIFACT_PATH = path.join(ARTIFACTS_PATH, path.basename(HTML_CONFIG_PATH));
export const WEBPACK_STATS_FILENAME = "stats.json";
export const ROUTES_FILENAME = "routes.json";

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
    ["react-router", "https://npmcdn.com/react-router@2.0.0/umd/ReactRouter.min.js", "ReactRouter"],
];

// Core configuration

const GLOBAL_STYLE_PATH = resolve("./src/styles/global.scss");


// App specific. Everthing that's used by webpackUtil that's not webpack's or it's plugin specific config is here.
let app = {
    isProduction: IS_PRODUCTION,
    externals: [], // This is used by the util to populate used external libs that are to be added to index template.
    externalLibs: EXTERNAL_LIBS,
    shouldInlineLibs: utils.shouldInlineLibs(),
};


let TextPlugins = {
    globalStyles: new ExtractTextPlugin(OUTPUT_CSS_FILENAME_PATTERN, { disable: !IS_PRODUCTION })
}

let config = {
    app,
    context: CONTEXT_PATH,
    entry: {
        main: "./main.ts"
    },
    output: {
        filename: OUTPUT_FILENAME_PATTERN,
        chunkFilename: OUTPUT_CHUNK_FILENAME_PATTERN,
        path: OUTPUT_PATH,
        pathInfo: !IS_PRODUCTION
    },
    resolve: {
        alias: {
            TweenMax: resolve("./node_modules/gsap/src/uncompressed/TweenMax.js"),                                                                      
        },
        extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".ts", ".tsx"]
    },
    resolveLoader: {
        alias: {
            "style": resolve("./tools/loaders/style/loader.js"),
            "log": resolve("./tools/loaders/log.js"),
        },
    },
    module: {
        noParse: [],
        loaders: [
            {
                test: /\.ts[x]?$/i,
                loader: "babel!ts",
                exclude: /node_modules/  
            },
            {
                test: /\.js[x]?$/i,
                loader: "babel",
                exclude: /node_modules/
            }, {
                test: /\.json$/i,
                loader: "json"
            },
            {
                test: GLOBAL_STYLE_PATH, 
                loader: TextPlugins.globalStyles.extract(["style"], ["css?-autoprefixer", "postcss", "sass"])
            },
            {
                test: /\.css$/i,
                loader: "style!css!postcss"
            }, {
                test: /\.scss$/i,
                exclude: GLOBAL_STYLE_PATH,
                loaders: ["style", "css?-autoprefixer", "postcss", "sass"]
            },
            { test: /\.(woff|woff2|eot|ttf)$/i, loader: 'url-loader?limit=100000' },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loaders: [
                    "url?limit=8192&name=" + OUTPUT_IMAGES_FILENAME_PATTERN,
                    "image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: '65-90', speed: 4}}"
                ]
            }, {
                test: /\.ico$/i,
                loader: "file?name=" + OUTPUT_IMAGES_FILENAME_PATTERN
            },
        ]
    },
    plugins: [],
    externals: {},
    watchOptions: {
        aggregateTimeout: 100
    },
    debug: !IS_PRODUCTION,
    devtool: "source-map",
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
        conservativeCollapse: true,
        removeRedundantAttributes: false,
        removeAttributeQuotes: false,
        collapseBooleanAttributes: false,
        useShortDoctype: true,
        removeScriptTypeAttributes: false,
        removeStyleLinkTypeAttributes: false,
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

// Common plugins

let commonPlugins = [
    new webpack.DefinePlugin({
        "__DEV__": !IS_PRODUCTION
    }),
    TextPlugins.globalStyles,
    new webpack.ProvidePlugin({
         _: "lodash", 
         TweenMax: "TweenMax",
    })
];

// Conditional plugins

let devPlugins = [
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({
        url: `http://${DEVSERVER_HOST}:${DEVSERVER_PORT}`
    }),
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

export function run() {
    return webpackUtils.run(config, ARTIFACTS_PATH, WEBPACK_STATS_FILENAME, STATIC_PATH, HTML_CONFIG_PATH, HTML_CONFIG_ARTIFACT_PATH);
}

export default config;