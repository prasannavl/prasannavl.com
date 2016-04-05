import _ from "lodash";
import chalk from "chalk";
import rendererUtils from "./rendererUtils";

export default class AppRenderer {

    constructor(contextManagerFactory, htmlConfig) {
        try {
           this.htmlConfig = htmlConfig;
           this.contextManager = contextManagerFactory.create();         
        } catch (err) {
            console.log(err);
            console.log(err.stack);
        }
    }

    run(req, res) {
        try {
            console.log("rendering: " + req.url);
            const cm = this.contextManager;
            const context = cm.createContext();
            cm.configureContext(context, _.cloneDeep(this.htmlConfig));
            cm.render(context, req.url);
            this.handleContextOutput(context, res);
        }
        catch (err) {
            console.error(chalk.red(err));
            console.log(err.stack);
            console.log();
            res.status(500).end();
        }
    }
    
    handleContextOutput(context, res) {
        const rendererState = context.services.rendererStateProvider();
        const { err, statusCode, data } = rendererState;
        switch (statusCode) {
            case 500: {
                throw err;
            }
            case 302: {
                res.status(statusCode, data);
                break;
            }
            case 200: {
                let inlinedCssModules = rendererUtils.getInlinedCssModules(rendererState.cssModules);
                let htmlConfig = Object.assign(rendererState.htmlConfig, { inlineCss: inlinedCssModules });
                let html = rendererUtils.renderHtml(htmlConfig);
                res.status(statusCode).send(html);
                break;
            }
            default: {
                res.status(statusCode).send(data);
            }
        }
    }
}