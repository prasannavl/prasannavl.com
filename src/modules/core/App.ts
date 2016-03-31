import { IAppContext } from "./AppContext";
import { ContextManagerFactory, IContextManager } from "./ContextManager";
import { ContextManager as DomContextManager } from "../dom-adapter/ContextManager";
import titleServiceData from "title-service-data";

export class App {
    private contextManager: IContextManager = null;
    private context: IAppContext = null;

    start(renderTargetId: string = "outlet", url?: string) {
        this._hintRequisites();
        if (__DOM__) {
            this._startForDom(renderTargetId, url);
        }
    }

    private _hintRequisites() {
        let style = require("../../styles/global.scss");
        let lodash = require("lodash");
        let tweenMax = require("gsap/src/uncompressed/TweenMax");

        if (__DEV__) {
            if (__DOM__) {
                style.insertIntoDom();
            }
        }
    }

    private _startForDom(renderTargetId: string, url?: string) {
        const cm = ContextManagerFactory.create() as DomContextManager;
        this.contextManager = cm;
        const context = cm.createContext();
        this.context = context;

        cm.configureContext(context, titleServiceData);

        const renderFunc = function() {
            const element = document.getElementById(renderTargetId);
            cm.setupRenderSurface(context, element);
            cm.render(context, url);
        };

        if (document.readyState === "loading") {
            this.scheduleOnDomLoaded(renderFunc);
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

    getModuleLoader() {
        return __webpack_require__;
    }

    scheduleOnDomLoaded(action: () => void) {
        const contentLoadedEvent = "DOMContentLoaded";
        const handler = function() {
            action();
            document.removeEventListener(contentLoadedEvent, handler);
        };
        document.addEventListener(contentLoadedEvent, handler);
    }
}