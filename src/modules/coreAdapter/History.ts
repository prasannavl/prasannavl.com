import createBrowserHistory from 'history/lib/createBrowserHistory'
import createRouterHistory from "react-router/lib/createRouterHistory";

export class HistoryFactory {
    static create() {
        return createRouterHistory(createBrowserHistory);
    }
}