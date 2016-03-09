export function getQueryString(path: string): string {
    const index = path.indexOf("?");
    return index > -1 && index < path.length ? path.slice(index + 1) : "";
}

export function getPath(path: string): string {
    const match = path.match(/^(https?:\/\/.*?)?(\/[^#\?]*?)/i);
    if (match) {
        return match[2];
    }
    else {
        throw new Error("Path invalid");
    }
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

export function parseLocation(path: string) {
    const match = path.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        protocol: match[1],
        host: match[2],
        hostname: match[3],
        port: match[4],
        pathname: match[5],
        search: match[6],
        hash: match[7]
    };
}