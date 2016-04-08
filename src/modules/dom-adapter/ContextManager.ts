import { IContextManager } from "../core/ContextManager";
import { IAppContext, AppContextFactory } from "../core/AppContext";
import React from "react";
import ReactDOM from "react-dom";
import { configureTitle } from "../core/TitleService";
import { IDomRendererState } from "../core/RendererState";

export class ContextManager implements IContextManager {
    createContext() {
        return AppContextFactory.create();
    }

    configureContext(context: IAppContext, options: any & DataModules.ITitleServiceData) {
        configureTitle(context.services.title, options);
    }

    setupRenderSurface(context: IAppContext, element: HTMLElement) {
        const rendererState = context.services.rendererStateProvider() as IDomRendererState;
        rendererState.renderSurface = element;
    }

    render(context: IAppContext, url?: string) {
        const state = context.services.rendererStateProvider() as IDomRendererState;
        const renderSurface = state.renderSurface;

        ReactDOM.render(React.createElement(context.services.appContainerProvider(), { context }), renderSurface, (el) => {
            // Remove all the styles that were inlined during static server side render
            let head = document.head;
            Array.from(head.getElementsByClassName("_svx")).forEach(x => head.removeChild(x));
        });
    }
}

export class ContentManagerFactory {
    static create() {
        return new ContextManager();
    }
}