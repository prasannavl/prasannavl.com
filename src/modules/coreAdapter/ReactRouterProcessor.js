import { match } from "react-router";

export class ReactRouterProcessor {
    process(ctx, url) {
        match({ routes: ctx.routes, location: url, history: ctx.history }, (error, redirectLocation, renderProps) => {
            let handlers = ctx.routeHandlerDescriptor;
            if (error) {
                handlers.errorHandler(ctx, error);
            } else if (redirectLocation) {
                handlers.redirectHandler(ctx, redirectLocation);
            } else if (renderProps) {
                handlers.renderHandler(ctx, renderProps);
            } else {
                handlers.notFoundHandle(ctx, url);
            }
        });
    }
}