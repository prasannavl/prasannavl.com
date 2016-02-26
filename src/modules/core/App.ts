import { IAppContext, AppContext, IClientPartialState, IContextManager, IServerState } from "./AppContext";
import * as env from "fbjs/lib/ExecutionEnvironment";
import { ContextManager } from "../coreAdapter/ContextManager";

export class App {
    private contextManager: IContextManager = null;
    private context: IAppContext = null;

    start(renderTargetId: string = "outlet", url?: string) {
        this.hintRequisites();
        if (env.canUseDOM) {
            this.startInternal(renderTargetId, url);
        }
    }

    hintRequisites() {
        let style = require("../../styles/global.scss");
        
        let tweenMax = require("gsap/src/uncompressed/TweenMax");
        let lodash = require("lodash");

        if (__DEV__) {
            if (env.canUseDOM) {
                (require("normalize.css")).insertIntoDom();
                style.insertIntoDom();
            }
        }
    }

    private startInternal(renderTargetId: string, url?:string) {
        const cm = new ContextManager();
        this.contextManager = cm;
        const context = cm.createContext();
        this.context = context;

        const renderFunc = function() {
            const element = document.getElementById(renderTargetId);
            const clientState = context.state as IClientPartialState;
            clientState.renderSurface = element;
            cm.render(context, url);
        };

        if (document.readyState === "loading") {
            this.scheduleOnLoad(renderFunc);
        } else {
            renderFunc();
        }
    }

    getContextManager() {
        return this.contextManager;
    }

    getContext() {
        return this.context;
    }

    scheduleOnLoad(action: () => void) {
        const contentLoadedEvent = "DOMContentLoaded";
        const handler = function() {
            action();
            document.removeEventListener(contentLoadedEvent, handler);
        };
        document.addEventListener(contentLoadedEvent, handler);
    } 
}