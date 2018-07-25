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

export function getErrorInfo(error) {
    if (!error) return "Error";
    return error.toString();
}

export function getErrorStack(error) {
    let stack = null;
    if (typeof (error) === "string") stack = error;
    else if (error) stack = error.stack || error.componentStack;
    if (!stack) return [];

    let stackItems = stack.split('\n').map(line => line.trim());
    if (stackItems.length < 2) return stackItems;
    return stackItems.splice(stack[0] == 'Error' ? 2 : 1);
}