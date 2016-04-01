export function createErrorCodeMap() {
    let codeMap = new Map();
    codeMap.set("500", "Internal server error");
    codeMap.set("501", "Not implemented");
    codeMap.set("502", "Bad gateway");
    codeMap.set("503", "Service unavailable");
    codeMap.set("504", "Gateway timeout");
    codeMap.set("505", "HTTP version not supported");
    codeMap.set("400", "Bad Request");
    codeMap.set("401", "Authorization required");
    codeMap.set("403", "Forbidden");
    codeMap.set("404", "Page Not Found");
    codeMap.set("405", "Method not allowed");
    codeMap.set("406", "Not acceptable (encoding)");
    codeMap.set("407", "Proxy authentication required");
    codeMap.set("408", "Request timed out");
    codeMap.set("409", "Conflicting request");
    codeMap.set("410", "Gone");
    codeMap.set("411", "Content length required");
    codeMap.set("412", "Precognition failed");
    codeMap.set("413", "Request entity too long");
    codeMap.set("414", "Request URI too long");
    codeMap.set("415", "Unsupported media type");
    return codeMap;
}