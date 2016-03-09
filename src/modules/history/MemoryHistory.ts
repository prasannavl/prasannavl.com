import { HistoryCore } from "./HistoryCore";
import { IHistoryContext } from "./HistorySpec";
import { HistoryContext } from "./HistoryContext";

export class MemoryHistory extends HistoryCore {

    go(delta?: any): any {
        throwNotImplemented();
    }

    replace(path: string, state?: any): any {
        throwNotImplemented();
    }

    push(path: string, state?: any): any {
        throwNotImplemented();
    }

    start() { }
    dispose() { }

    setContext(context: IHistoryContext) {
        this.context = context;
    }
}

function throwNotImplemented() {
    throw new Error("go, replace, and push are not implemented for memory history.");
}