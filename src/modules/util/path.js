import { trimRight } from "./lang";

export function getQueryString(path) {
    const index = path.indexOf("?");
    return index > -1 ? path.slice(index + 1) : "";
}

export function getPathName(path) {
    if (!path) path = "";
    const match = path.match(/^((https?:)?\/\/.*?)?\/([^#\?]*?)?(\/)*$/i);
    if (match) {
        const pathname = match[3];
        return "/" + (pathname || "");
    }
    return "/" + path;
}

export function getHash(path) {
    const index = getHashIndex(path);
    return index > -1 ? path.slice(index + 1) : "";
}

export function getHashIndex(path) {
    let index = path.indexOf("#");
    while (index > -1) {
        const nextCharIndex = index + 1;
        if (path[nextCharIndex] !== "!") return index;
        index = path.indexOf("#", index);
    }
    return -1;
}

export function trimRightSlashes(str) {
    let res = trimRight(str, "/");
    if (res.length > 0) {
        return res;
    }
    return "/";
}