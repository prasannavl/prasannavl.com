export function trimLeft(str, delimiter) {
    let res = str;
    while (res.startsWith(delimiter)) {
        res = res.slice(1);
    }
    return res;
}

export function trimRight(str, delimiter) {
    let res = str;
    while (res.endsWith(delimiter)) {
        res = res.slice(0, -1);
    }
    return res;
}