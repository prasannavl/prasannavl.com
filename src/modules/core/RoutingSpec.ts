import { IAppContext } from "./AppContext";

export interface IRouteProcessor {
    process(ctx: IAppContext, url: string): void;
}