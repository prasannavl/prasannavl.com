import React from "react";
import { trimRightSlashes } from './modules/util/path';
import { NotFoundPage, OfflinePage } from "./pages/ErrorPage";
import { result } from "./modules/util/router";

async function resolveStaticRoutes(pathname) {
    // NOTE: It's important that the name of the import is given manually
    // as a string so that webpack can import the required js page.
    // This cannot be abstracted to a dynamic string.
    switch (pathname) {
        case "/":
            return (await import("./pages/Home"));
        case "/archives":
            return (await import("./pages/Archives"));
        default:
            return null;
    }
}

export default async function resolver(path) {
    let pathname = trimRightSlashes(path);
    try {
        let res = await resolveStaticRoutes(pathname);
        if (res != null) {
            return result(res.default, pathname);
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

async function resolvePostRoutes(pathname) {
    try {
        if (pathname.length < 6) return null;
        let itemModule = await import("./posts" + pathname + ".jsx");
        let postItemComponent = itemModule.default;
        let postModule = await import("./pages/Post");
        let Post = postModule.default;
        return () => React.createElement(Post, { component: postItemComponent });
    } catch (err) {
        let e = err.toString();
        if (e.startsWith("Error: Cannot find module")) {
            console.log(err);
            return NotFoundPage;
        }
        throw err;
    }
}
