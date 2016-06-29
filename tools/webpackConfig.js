import webpack from "webpack";
import utils from "./utils";
import webpackUtils from "./webpackUtils";
import configConstantsFactory from "../configConstants";
import path from "path";
import ExtractTextPlugin from "extract-text-webpack-plugin";

export function create(options) {
    let { isProduction, shouldInlineLibs, isServerRenderer, paths, outputPatterns, artifactConfig, serverConfig, externalLibs, htmlConfig } = options;
    let resolve = utils.createResolverForPath(paths.dir);
    
    if (isServerRenderer) {
        // Patch output directories, so that new server side build happens directly on the filesystem, and 
        // can be inspected.
        paths.outputDirRelativeName = path.join(paths.serverRenderDirRelativeName, paths.outputDirRelativeName);
        paths.artifactDirRelativeName = path.join(paths.serverRenderDirRelativeName, paths.artifactDirRelativeName);
    }
    
    let resolvedPaths = {
        contextDirPath: resolve(paths.contextDirRelativeName),
        outputDirPath: resolve(paths.outputDirRelativeName),
        staticDirPath: resolve(paths.staticDirRelativeName),
        artifactDirPath: resolve(paths.artifactDirRelativeName),
        globalStylePath: resolve(paths.globalStyleFileRelativeName),
    };

    let artifactResolve = utils.createResolverForPath(resolvedPaths.artifactDirPath);
    let resolvedArtifactConfig = {
        htmlConfigPath: artifactResolve(artifactConfig.htmlConfigFileName),
        webpackStatsPath: artifactResolve(artifactConfig.webpackStatsFileName),
        routesPath: artifactResolve(artifactConfig.routesFileName),
        webpackBuiltConfigPath: artifactResolve(artifactConfig.webpackBuiltConfigFileName),
        dataTitleServicePath: artifactResolve(artifactConfig.dataTitleServiceFileName),
    };

    let app = {
        isProduction,
        isServerRenderer,
        externals: [], // This is used by the util to populate used external libs that are to be added to index template.
        externalLibs,
        shouldInlineLibs: shouldInlineLibs || isServerRenderer,
        paths: resolvedPaths,
        artifactConfig: resolvedArtifactConfig,
        htmlConfig,
        version: require("../package.json").version,
        buildNumber: Date.now()
    };

    let TextPlugins = {
        globalStyles: new ExtractTextPlugin(outputPatterns.cssFileName, { disable: !isProduction })
    }

    let config = {
        app,
        context: resolvedPaths.contextDirPath,
        entry: {
            main: "./main.ts"
        },
        target: isServerRenderer ? "node" : "web",
        output: {
            filename: outputPatterns.jsFileName,
            chunkFilename: outputPatterns.jsChunkFileName,
            path: resolvedPaths.outputDirPath,
            pathInfo: !isProduction,
            publicPath: serverConfig.publicPath,
        },
        resolve: {
            alias: {
                "title-service-data": resolvedArtifactConfig.dataTitleServicePath,
                TweenMax: resolve("./node_modules/gsap/src/uncompressed/TweenMax.js"),
            },
            extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx", ".ts", ".tsx"]
        },
        externals: { },        
        resolveLoader: {
            root: path.join(__dirname, "../node_modules"),
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
                    exclude: [/node_modules/]
                }, {
                    test: /\.json$/i,
                    loader: "json"
                },
                {
                    test: resolvedPaths.globalStylePath,
                    loader: TextPlugins.globalStyles.extract(["style"], ["css?-autoprefixer-import", "postcss", "sass"])
                },
                {
                    test: /\.css$/i,
                    loader: "style!css-autoprefixer!postcss"
                }, {
                    test: /\.scss$/i,
                    exclude: resolvedPaths.globalStylePath,
                    loaders: ["style", "css?-autoprefixer", "postcss", "sass"]
                },
                { test: /\.(woff|woff2|eot|ttf)$/i, loader: "url-loader?limit=100000" },
                {
                    test: /\.(gif|png|jpe?g|svg)$/i,
                    loaders: [
                        "url?limit=8192&name=" + outputPatterns.imageFileName,
                        "image-webpack?{progressive:true, optimizationLevel: 3, interlaced: false, pngquant:{quality: '65-90', speed: 4}}"
                    ]
                }, {
                    test: /\.ico$/i,
                    loader: "file?name=" + outputPatterns.imageFileName
                }
            ]
        },
        plugins: [],
        watchOptions: {
            aggregateTimeout: 100
        },
        debug: !isProduction,
        devtool: "source-map",
        devServer: {
            contentBase: resolvedPaths.staticDirPath,
            host: serverConfig.host,
            port: serverConfig.port,
            historyApiFallback: {
                index: serverConfig.indexPath
            },
            quiet: false,
            noInfo: false,
            devtool: "cheap-module-eval-source-map",
            publicPath: serverConfig.publicPath,
            hot: !isProduction,
            lazy: false,
            stats: {
                colors: true
            }
        },
        postcss: () => {
            return {
                defaults: [
                    require("postcss-discard-comments")(isProduction ? { removeAll: true } : false),
                    require("postcss-calc"),
                    require("postcss-reduce-transforms"),
                    require("postcss-reduce-idents"),
                    require("postcss-merge-rules"),
                    require("postcss-merge-idents"),
                    //require("postcss-discard-duplicates"),
                    require("autoprefixer"),
                ],
            };
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
            comments: !isProduction,
            mangle: isProduction,
            compressor: {
                warnings: false
            },
            "screw-ie8": true
        }
    };

    // Apply configurations

    config = webpackUtils.weaveConfiguration(config, devConfig, productionConfig);

    // Common plugins    
    
    let commonPlugins = [
        new webpack.DefinePlugin({
            "__DEV__": !isProduction,
            "__DOM__": !isServerRenderer,
            "__app_version__": JSON.stringify(app.version),
            "__app_build_number__": app.buildNumber,
        }),
        TextPlugins.globalStyles,
        new webpack.ProvidePlugin({
            TweenMax: "TweenMax",
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]+locale$/, /en/), // moment js locale
    ];
    
    // Conditional plugins

    const OpenBrowserPlugin = require("open-browser-webpack-plugin");

    const openBrowserHost = serverConfig.host === "0.0.0.0" ? "localhost" : serverConfig.host;
    let devPlugins = [
        new webpack.NoErrorsPlugin(),
        new OpenBrowserPlugin({
            url: `http://${openBrowserHost}:${serverConfig.port}`
        }),
    ];

    let productionPlugins = [
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(true),
        new webpack.optimize.UglifyJsPlugin(productionConfig.uglifyJsOpts),
    ];
    
    // Apply plugins

    webpackUtils.applyPlugins(config, commonPlugins, devPlugins, productionPlugins);
    return config;
}

export function createDefault(options) {
    let configConstants = configConstantsFactory();    
    options = Object.assign({}, {
        paths: configConstants.Paths,
        outputPatterns: configConstants.OutputPatterns,
        htmlConfig: configConstants.HtmlConfig,
        artifactConfig: configConstants.ArtifactConfig,
        serverConfig: configConstants.ServerConfig,
        externalLibs: configConstants.ExternalLibs,
    }, configConstants.DefaultOptions, options);

    return create(options);
}

export function runDefault(options) {
    let config = createDefault(options);
    return webpackUtils.run(config);
}