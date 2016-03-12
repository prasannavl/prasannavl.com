export function getQueryString(path: string): string {
    const index = path.indexOf("?");
    return index > -1 && index < path.length ? path.slice(index + 1) : "";
}

export function getPathName(path: string): string {
    if (!path) path = "";
    const match = path.match(/^((https?:)?\/\/.*?)?\/([^#\?]*)?/i);
    if (match) {
        const pathname = match[3];
        return "/" + (pathname || "");
    }
    return "/" + path;
}

export function getHash(path: string): string {
    const index = getHashIndex(path);
    return index > -1 ? path.slice(index + 1) : "";
}

export function getHashIndex(path: string) {
    let index = path.indexOf("#");
    while (index > -1 && index < path.length) {
        const nextCharIndex = index + 1;
        if (path[nextCharIndex] !== "!") return index;
        index = path.indexOf("#", index);
    }
    return -1;
}