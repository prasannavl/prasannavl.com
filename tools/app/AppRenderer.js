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
        this.getRouteFactory(routeFactory => {
            const cm = this.contextManager;
            const context = cm.createContext();
            this.setupContext(context, routeFactory, res);
            cm.render(context, req.url);
            this.handleContextOutput(context, res);
        });
    }
    
    setupContext(context, routeFactory, req) {
        context.routeFactory = routeFactory;
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

    getRouteFactory(cb) {
        if (!this.routeFactory) {
            webpackRequire(this.config, require.resolve("../../src/routeFactory"), (err, factory) => {
                let routeFactory = factory().default;
                this.routeFactory = routeFactory;
                cb(routeFactory);
            });
        } else { cb(this.routeFactory); }
    }
}