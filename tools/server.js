import { createAppServerAsync, runServer, createStaticServerAsync } from "./serverUtils"
import utils from "./utils";
import { createDefault as webpackConfigFactory } from "./webpackConfig";

function getWebpackConfig() {
    let config = webpackConfigFactory({ isServerRenderer: true });
    return config;
}

export function getServerListenerFactoryAsync(log = false) {
    let config = getWebpackConfig();
    let defaultHost = config.devServer.host;
    let defaultPort = config.devServer.port;
    return createAppServerAsync(config, log)
        .then(server => ({ port = defaultPort, host = defaultHost, shouldOpen = false }) => runServer(server, host, port, shouldOpen));
}

export function getStaticServerListenerFactoryAsync(log = false) {
    let config = getWebpackConfig();
    let defaultHost = config.devServer.host;
    let defaultPort = config.devServer.port;
    return createStaticServerAsync(config, log)
        .then(server => ({ port = defaultPort, host = defaultHost, shouldOpen = false }) => runServer(server, host, port, shouldOpen));
}

function run() {
    let shouldRun = utils.hasCommandLineArg("run");
    let log = utils.hasCommandLineArg("verbose");
    let isStaticServer = utils.hasCommandLineArg("static");
    
    if (shouldRun) {
        let factory = isStaticServer ? getStaticServerListenerFactoryAsync : getServerListenerFactoryAsync;
        factory(log)
            .then(runAppServer => runAppServer({ shouldOpen: false }))
            .catch(err => console.log(err.toString().replace("\\n", "\n")));
    }
}

run();