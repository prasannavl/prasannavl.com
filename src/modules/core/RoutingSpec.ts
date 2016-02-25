import { IAppContext } from "./AppContext";

export interface IRouteProcessor {
    process(ctx: IAppContext, url: string): void;
}

export interface IRouteHandlerDescriptor {
    errorHandler(ctx: IAppContext, err: any): void;
    renderHandler(ctx: IAppContext, state: any): void;
    redirectHandler(ctx: IAppContext, nextLocation: any): void;
    notFoundHandle(ctx: IAppContext, location: any): void;
}