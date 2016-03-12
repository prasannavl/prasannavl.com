import { IHistoryContext } from "./HistorySpec";
import { getQueryString, getPathName, getHash } from "./utils";

export class HistoryContext implements IHistoryContext {
    url: string;
    pathname: string;
    queryString: string;
    hash: string;
    state: any;

    private _root: IHistoryContext = null;
    private _parent: IHistoryContext = null;

    static createEmpty() {
        return new HistoryContext(null, null, null, null, null);
    }

    static createFromPath(path: string, state: any = null) {
        return new HistoryContext(path, getPathName(path), getQueryString(path), getHash(path), state);
    }

    constructor(url: string, pathname: string, queryString: string, hash: string, state: any) {
        this.url = url;
        this.pathname = pathname;
        this.queryString = queryString;
        this.hash = hash;
        this.state = state;
    }

    getParent() {
        return this._parent;
    }

    getRoot(): IHistoryContext {
        return this._root || this;
    }

    createChild(): IHistoryContext {
        return Object.assign({}, this, { _parent: this, _root: this._root || this });
    }
}