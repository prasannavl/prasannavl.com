import React from "react";
import { trimRightSlashes } from './modules/path-utils';
import { NotFoundPage, OfflinePage } from "./pages/ErrorPage";
import { result } from "./modules/router";

export default async function resolver(path) {
    try {
        let pathname = trimRightSlashes(path);
        let res = await resolveStaticRoutes(pathname);
        if (res != null) {
            return result(res, pathname);
        }
        res = await resolvePostRoutes(pathname);
        if (res != null) {
            return result(res, pathname);
        }
        return result(NotFoundPage, pathname, false);
    } catch (err) {
        let e = err.toString();
        if (e.startsWith("Error: Loading chunk")) {
            console.log(err);
            return result(OfflinePage, pathname, false);
        }
        throw err;
    }
}

async function resolveStaticRoutes(pathname) {
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

async function resolvePostRoutes(pathname) {
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
            console.log(err);
            return NotFoundPage;
        }
        throw err;
    }
}
