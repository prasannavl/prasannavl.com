import webpackRequire from "webpack-require";
import { ContextManager } from "./ContextManager";
import * as _ from "lodash";
 
export default class AppRenderer {
     
    constructor(webpackConfig, webpackStats, htmlConfig) {
        this.config = webpackConfig;
        this.htmlConfig = htmlConfig;
        this.webpackStats = webpackStats;
        this.contextManager = new ContextManager();
    }

    run(req, res) {
        this.getRoutes(routes => {
            const cm = this.contextManager;
            const context = cm.createContext();
            this.setupContext(context, routes);
            cm.render(context, req.url);
            this.handleContextOutput(context, res);
        });
    }
    
    setupContext(context, routes) {
        context.routes = routes;
        context.state.htmlConfig = _.cloneDeep(this.htmlConfig);
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

    getRoutes(cb) {
        if (!this.routes) {
            webpackRequire(this.config, require.resolve("../../src/routes"), (err, factory, stats, fs) => {
                let routes = factory().default;
                this.routes = routes;
                cb(routes);
            });
        } else { cb(this.routes); }
    }
}