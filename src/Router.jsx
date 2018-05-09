import React from "react";
import { trimRightSlashes } from './modules/path-utils';
import { NotFoundPage, OfflinePage } from "./pages/ErrorPage";

const POPSTATE_EVENT = "popstate";

export class Router {
    constructor() {
        this._popStateHandler = null;
    }

    startListen(popStateEventHandler) {
        this.stopListen();
        this._popStateHandler = popStateEventHandler;
        window.addEventListener(POPSTATE_EVENT, this._popStateHandler);
    }

    stopListen() {
        if (!this._popStateHandler) return;
        window.removeEventListener(POPSTATE_EVENT, this._popStateHandler);
        this._popStateHandler = null;
    }

    async resolveComponent() {
        try {
            let pathname = trimRightSlashes(location.pathname);
            let res = await this.resolveStaticRoutes(pathname);
            if (res != null) {
                return res;
            }
            res = await this.resolvePostRoutes(pathname);
            if (res != null) {
                return res;
            }
            return NotFoundPage;
        } catch (err) {
            let e = err.toString();
            if (e.startsWith("Error: Loading chunk")) {
                console.log(err);
                return OfflinePage;
            }
            throw err;
        }
    }
    
    async resolveStaticRoutes(pathname) {
        let m;
        switch (pathname) {
            case "/":
                m = await import("./pages/Home");
                return m.default;
            case "/archives":
                m = await import("./pages/Archives");
                return m.default;
            default:
                return null;
        }
    }
    
    async resolvePostRoutes(pathname) {
        try {
            if (pathname.length < 6) return null;
            let itemModule = await import("./posts" + pathname + ".jsx");
            let postItemComponent = itemModule.default;
            let postModule = await import("./pages/Post");
            let Post = postModule.default;
            return () => <Post component={postItemComponent} />;
        } catch (err) {
            let e = err.toString();
            if (e.startsWith("Error: Cannot find module")) {
                return NotFoundPage;
            }
            throw err;
        }
    }
}
