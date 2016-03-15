export class ContentManager {
    getContentComponent(pathname: string) {
        if (pathname === "/overview") {
            return "Overview";
        }
        const contentRegex = /\/(\d{4})\/(.*)/i;
        const match = contentRegex.exec(pathname);
        if (match) {
            return "Matched element";
        }
        else {
            return null;
        }
    }

    getRawContent(path: string) {
        
    }
}
