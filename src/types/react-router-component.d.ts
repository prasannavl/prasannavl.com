declare module "react-router-component" {
    export interface Router {
        getPath(): string;
        navigate(path: string, navigation?: any, cb?: any): void;
        makeHref(path: string): string;
    }

    export let Locations: any;
    export let Location: any;
}

declare module "react-router-component/lib/Link" {
    export let Link: any;
    export default Link;
}