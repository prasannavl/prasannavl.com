import { createAppServerAsync, runServer } from "./serverUtils"
import utils from "./utils";
import { createDefault as webpackConfigFactory } from "./webpackConfig";

function getWebpackConfig() {
    return webpackConfigFactory({ isServerRenderer: true, isProduction: true });
}

export function getServerListenerFactoryAsync(log = false) {
    let config = getWebpackConfig();
    let defaultHost = config.devServer.host;
    let defaultPort = config.devServer.port;
    return createAppServerAsync(config, log)
        .then(server => (port, host) => runServer(server, host = defaultHost, port = defaultPort));
}

function run() {
    let shouldRun = utils.hasCommandLineArg("run");
    let log = utils.hasCommandLineArg("verbose");
    if (shouldRun) {
        getServerListenerFactoryAsync(log)
            .then(runAppServer => runAppServer())
            .catch(err => console.log(err.toString().replace("\\   n", "\n")));
    }
}

run();