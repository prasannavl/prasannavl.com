import { HistoryListener, IHistoryContext, IHistory } from "./HistorySpec";
import { HistoryCore } from "./HistoryCore";
import { HistoryContext } from "./HistoryContext";

const POPSTATE_EVENT_KEY = "popstate";

export class BrowserHistory extends HistoryCore {

    static createContext() {
        const location = window.location;
        const url = location.href;
        const pathname = location.pathname;
        const queryString = location.search;
        const hash = location.hash;
        const state = window.history.state;

        return new HistoryContext(url, pathname, queryString, hash, state);
    }

    private _popStateListener: (ev: any) => void = null;

    constructor() {
        super();
    }

    get length() {
        return window.history.length;
    }

    go(delta?: any) {
        return this._processBeforeChange(null).then(change => {
            if (change) window.history.go(delta);
            return change;
        });
    }

    replace(path: string, state: any) {
        return this._processBeforeChange(null).then(change => {
            if (change) {
                window.history.replaceState(state, null, path);
                return this._process(BrowserHistory.createContext()).then(() => true);
            }
            return false;
        });
    }

    push(path: string, state: any) {
        return this._processBeforeChange(null).then(change => {
            if (change) {
                window.history.pushState(state, null, path);
                return this._process(BrowserHistory.createContext()).then(() => true);
            }
            return false;
        });
    }

    dispose() {
        if (this._popStateListener) window.removeEventListener(POPSTATE_EVENT_KEY, this._popStateListener);
    }

    start() {
        this.context = BrowserHistory.createContext();

        const handler = (ev: any) => {
            this._process(this.context);
        };
        window.addEventListener(POPSTATE_EVENT_KEY, handler);
        this._popStateListener = handler;
    }
}