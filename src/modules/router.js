import { trimRightSlashes } from './path-utils';
import { EventEmitter } from 'events';

class RouteTransitionEvent {
    constructor(router, transitionState, eventName) {
        this.router = router;
        this.error = transitionState.error;
        this.path = transitionState.path;
        this.id = transitionState.id;
        this.state = transitionState;
        this.eventName = eventName;
    }
}

class RouteChangedEvent {
    constructor(router, transitionState) {        
        this.path = transitionState.path;
        this.id = transitionState.id;
        this.scroll = transitionState.scroll;
        this.router = router;
        let { component, success } = router.state;
        this.component = component;
        this.success = success;
        this.state = transitionState;
    }
}

export class Router extends EventEmitter {
    static CHANGE_STARTED_EVENT = "changestart";
    static CHANGE_ABORTED_EVENT = "changeabort";
    static CHANGE_EVENT = "change";

    constructor(resolver) {
        super();
        this._resolver = resolver;
        this._disposeListener = null;
        this._onPopState = this._onPopState.bind(this);

        this.state = result(null, null, false);
        this.transitionId = 0;
    }

    listen(popStateEventHandler) {
        window.addEventListener(POPSTATE_EVENT, popStateEventHandler);
        return function () {
            window.removeEventListener(POPSTATE_EVENT, popStateEventHandler);
        };
    }

    start() {
        this.stop();
        this._disposeListener = this.listen(this._onPopState);
        this._onPopState(null);
    }

    stop() {
        if (this._disposeListener) {
            this._disposeListener();
            this._disposeListener = null;
        }
    }

    resolve(path) {
        return this._resolver(path);
    }

    go(path, opts) {
        if (!opts) opts = defaultPathOpts();
        if (opts.handler === undefined) {
            opts.handler = this._onPopState;
        }
        push(path, opts);
    }

    _verifyTransition(transitionId, verficationId) {
        if (verficationId == null) {
            verficationId = this.transitionId;
        }
        if (transitionId !== verficationId) {
            return false;
        }
        return true;
    }

    _newTransitionId() {
        if (this.transitionId > Number.MAX_SAFE_INTEGER) {
            this.transitionId = 0;
        }
        return ++this.transitionId;
    }

    async _onPopState(ev) {
        let pathString = getCurrentPath();
        let tState;
        let scroll;
        if (ev && ev.state && ev.state._transition) {
            tState = ev.state._transition;
        }
        if (tState) {
            scroll = tState.scroll;
        }
        let transitionId = this._newTransitionId();
        let transitionContextState = {
            id: transitionId,
            path: pathString,
            scroll: scroll,
            error: null,
        };
        this.emit(Router.CHANGE_STARTED_EVENT,
            new RouteTransitionEvent(this, transitionContextState, Router.CHANGE_STARTED_EVENT));
        let res;
        try {
            res = await this.resolve(pathString);
            if (!this._verifyTransition(transitionId)) {
                this._abortChange(transitionContextState);
                return;
            }
            this.state = res;
        } catch (err) {
            transitionContextState.error = err;
            this._abortChange(transitionContextState);
            return;
        }
        this.emit(Router.CHANGE_EVENT,
            new RouteChangedEvent(this, transitionContextState));
    }

    _abortChange(transitionState) {
        this.emit(Router.CHANGE_ABORTED_EVENT,
            new RouteTransitionEvent(this, transitionState, Router.CHANGE_ABORTED_EVENT));
    }
}

const POPSTATE_EVENT = "popstate";

export function getCurrentPath() {
    let lc = window.location;
    return lc.pathname + lc.search + lc.hash;
}

export function getPathString(path) {
    let pathString;
    if (path && typeof (path) === "object") {
        pathString = serializePath(path);
    } else {
        pathString = path;
    }
    return pathString;
}

function defaultPathOpts() {
    return { 
        state: undefined,
        replace: undefined,
        scroll: undefined,
        handler: undefined,
        id: -1,
    }
}

export function push(path, opts) {
    if (!opts) opts = defaultPathOpts();
    let { state, replace, scroll, handler } = opts;
    
    let pathString = getPathString(path);

    if (scroll !== false) {
        scroll = true;
    }

    let finalState = Object.assign({}, state, { _transition: { scroll } });

    // Prevent same state accidental pushes in history.
    if (replace == null) {
        let cPath = getCurrentPath();
        if (trimRightSlashes(pathString) === trimRightSlashes(cPath)
            && history.state == finalState) {
            replace = true;
        }
    }

    if (replace) {
        window.history.replaceState(finalState, undefined, pathString);
    } else {
        window.history.pushState(finalState, undefined, pathString);
    }

    if (handler) {
        handler({ state: finalState });
    } else {
        window.dispatchEvent(new PopStateEvent('popstate', { state: finalState }));
    }
}

export function serializePath({ pathname, query, hash }) {
    if (!pathname) pathname = "";
    return pathname + getQueryString(query) + getHashString(hash);

    function getQueryString(query, qPrefix = true) {
        if (!query) return "";
        if (typeof (query) === "string") {
            let startsWithQ = query.startsWith("?");
            if (startsWithQ) {
                return qPrefix ? query : query.slice(1);
            }
            return qPrefix ? "?" + query : query;
        }
        let sp = new URLSearchParams();
        Object.keys(query).forEach(x => {
            sp.append(x, query[x]);
        });
        return qPrefix ? "?" + sp.toString() : sp.toString();
    }

    function getHashString(hash, hashPrefix) {
        if (!hash) return "";
        let startsWithHash = hash.startsWith("#");
        if (startsWithHash) {
            return hashPrefix ? hashPrefix : hashPrefix.slice(1);
        }
        return hashPrefix ? "#" + hashPrefix : hashPrefix;
    }
}

export function result(component, path, success = true) {
    return { success, component, path };
}

export function shouldDispatchDefaultClickEvent(e) {
    return (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
}

export function LinkHandler(props) {
    return function defaultLinkHandler(event) {
        if (shouldDispatchDefaultClickEvent(event)) return;
        const { scroll, replace, state, onClick, href: path } = props;
        if (onClick) onClick(event);
        if (event.defaultPrevented) return;
        event.preventDefault();
        push(path, { state, scroll, replace })
    }
}