const path = require("path");

module.exports = {
  use: [
    (neutrino) => {

      const isProduction = process.env.NODE_ENV === "production";

      neutrino.use("@neutrinojs/react",
        {
          publicPath: "/",
          html: {
            title: 'prasannavl.com',
            mobile: false,
            template: "./src/templates/index.ejs",
          },
          image: {
            img: { name: "img/[name].[hash].[ext]" },
            ico: { name: "img/ico/[name].[hash].[ext]" },
            svg: { name: "svg/[name].[hash].[ext]" }
          },
          font: {
            woff: { name: "fonts/[name].[hash].[ext]" },
            ttf: { name: "fonts/[name].[hash].[ext]" },
            eot: { name: "fonts/[name].[hash].[ext]" }
          },
          style: {
            // workaround bug https://github.com/mozilla-neutrino/neutrino-dev/issues/802
            hot: !isProduction,
            test: neutrino.regexFromExtensions(["css", "scss", "sass"]),
            loaders: [
              {
                loader: 'sass-loader',
                useId: 'sass',
                options: {
                  includePaths: [path.resolve("./src/styles")]
                }
              }
            ],
            extract: {
              plugin: {
                filename: "css/[name].[contenthash].css"
              }
            }
          },
          targets: {
            browsers: [
              "> 1%"
            ]
          },
          manifest: {
            fileName: "webpack/manifest.json"
          }
        });

      const config = neutrino.config;

      config.output
        .chunkFilename("js/chunks/[name].[chunkhash].js")
        .when(isProduction, output => {
          output
            .filename("js/[name].[chunkhash].js")
            .sourceMapFilename("js/[file].[chunkhash].map");
        }, output => {
          output
            .filename("js/[name].[hash].js")
            .sourceMapFilename("js/[file].[hash].map");
        });

      // config.resolve.alias
        // .set("app", path.resolve(__dirname, "./src"));
      
      config.module
        .rule("raw")
        .test(neutrino.regexFromExtensions(["txt"]))
        .use("raw")
        .loader("raw-loader");
      
      config.module
        .rule("worker")
        .test(/\.worker\.js$/)
        .use("worker")
        .loader("workerize-loader")
        .options({
          name: isProduction ? "js/workers/[id].[chunkhash]" : undefined,
          chunkFilename: "chunk-[id].[chunkhash]",
        });

      config.entry('vendor')
        .add('react')
        .add('react-dom')
        .add('react-helmet');
      
      const webpack = require("webpack");
      
      config.plugin("common-chunk")
        .use(webpack.optimize.CommonsChunkPlugin, [{
          async: "common",
          chilren: true,
          minChunks: function (m, count) {
            return m.context && m.context.includes("node_modules");
          }
        }])
        .before("vendor-chunk");
      

      if (process.env.WEBPACK_ANALYZE) {
        enableBundleAnalyzer(config);
      }

    },
    '@neutrinojs/jest',
    ["@neutrinojs/copy", {
      patterns: [
        { from: "**/*", context: "./public", to: "./" },
        { from: "static/**/*", context: "./src", to: "./" }
      ],
    }]
  ]
};

function enableBundleAnalyzer(config) {
  config.plugin("bundle-analyzer")
    .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
}