import webpackRequire from "webpack-require";
import { ContextManager } from "./ContextManager";
import * as _ from "lodash";
import chalk from "chalk";
import utils from "../utils";

export default class AppRenderer {
     
    constructor(webpackConfig, webpackStats, htmlConfig) {
        this.config = webpackConfig;
        this.htmlConfig = htmlConfig;
        this.webpackStats = webpackStats;
        this.contextManager = new ContextManager();
    }

    run(req, res) {
        this.getAppContainer(appContainer => {
            try {
                if (!appContainer) throw new Error("Couldn't get appContainer");
                const cm = this.contextManager;
                const context = cm.createContext();
                this.setupContext(context, appContainer, req);
                cm.render(context, req.url);
                this.handleContextOutput(context, res);
            }
            catch (err) {
                console.error(chalk.red(err));
                res.status(500).end();
            }
        });
    }
    
    setupContext(context, appContainer, req) {
        context.appContainer = appContainer;
        const htmlConfig = _.cloneDeep(this.htmlConfig);
        htmlConfig.canonical += req.url;
        context.state.htmlConfig = htmlConfig;
    }
    
    handleContextOutput(context, res) {
        const { err, statusCode, data } = context.state;
        switch (statusCode) {
            case 500: {
                res.status(statusCode).send(err.message);
                break;               
            }
            case 302: {
                res.status(statusCode, data);
                break;
            }
            default: {
                res.status(statusCode).send(data);
            }
        }
    }

    getAppContainer(cb) {
        
        function error(err) {
            console.error(chalk.red(err));
            this.appContainerErr = err || {};
            this._appContainerLoadInProgress = false;
            cb(null);
        }
        
        if (!this.appContainer && this.appContainerErr === undefined) {
            if (!this._appContainerLoadInProgress) {
                this._appContainerLoadInProgress = true;
                try {                                        
                    webpackRequire(this.config, require.resolve("../../src/components/AppContainer.tsx"), (err, factory) => {
                        if (err) { error.call(this, err); return; }
                        const initFact = factory();
                        let appContainer = initFact.default;
                        this.appContainer = appContainer;
                        delete this._appContainerLoadInProgress;
                        cb(appContainer);
                    });
                } catch (err) {
                    error.call(this, err);
                }
            } else {
                setTimeout(() => this.getAppContainer(cb), 50);
            }
        } else { cb(this.appContainer); }
    }
}