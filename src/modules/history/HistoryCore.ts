import { HistoryListener, HistoryBeforeChangeListener, IHistoryContext, IHistory, HistoryListenerDelegate, HistoryBeforeChangeListenerDelegate } from "./HistorySpec";

export abstract class HistoryCore implements IHistory {

    context: IHistoryContext;
    length: number;

    private _listeners: HistoryListener[];
    private _beforeChangeListeners: HistoryBeforeChangeListener[];

    private _cachedListenerPipelineFunc: HistoryListenerDelegate = null;
    private _cachedBeforeChangeListenerPipelineFunc: HistoryBeforeChangeListenerDelegate = null;

    constructor() {
        this._listeners = [];
        this._beforeChangeListeners = [];
    }

    abstract start(): void;
    abstract dispose(): void;
    abstract go(delta?: any): Promise<boolean>;
    abstract replace(url: string, state?: any): Promise<boolean>;
    abstract push(url: string, state?: any): Promise<boolean>;

    listen(listener: HistoryListener) {
        const disposable = () => {
            const index = this._listeners.indexOf(listener);
            this._listeners.splice(index, 1);
        };
        this._listeners.push(listener);
        this._cachedListenerPipelineFunc = null;
        return disposable;
    }

    listenBeforeChange(listener: HistoryBeforeChangeListener) {
        const disposable = () => {
            const index = this._beforeChangeListeners.indexOf(listener);
            this._beforeChangeListeners.splice(index, 1);
        };
        this._beforeChangeListeners.push(listener);
        this._cachedBeforeChangeListenerPipelineFunc = null;
        return disposable;
    }

    protected _process(context: IHistoryContext) {
        if (this._cachedListenerPipelineFunc === null) {
            const cachedResult = Promise.resolve();
            this._cachedListenerPipelineFunc = this._buildPipeline(this._listeners, () => cachedResult, "HistoryListener");
        }
        return this._cachedListenerPipelineFunc(context);
    }

    protected _processBeforeChange(context: IHistoryContext): Promise<boolean> {
        if (this._cachedBeforeChangeListenerPipelineFunc === null) {
            const cachedResult = Promise.resolve(true);
            this._cachedBeforeChangeListenerPipelineFunc = this._buildPipeline(this._beforeChangeListeners.reverse(), () => cachedResult, "HistoryBeforeChangeListener");
        }
        return this._cachedBeforeChangeListenerPipelineFunc(context);
    }

    private _buildPipeline(listeners: any[], defaultFunc: any, pipeLineName: string): any {
        const len = listeners.length;
        let next = defaultFunc;
        if (len > 0) {
            let i = len - 1;
            while (i > -1) {
                let current = listeners[i];
                let nextFunc = next;
                next = (context: IHistoryContext) => {
                    let res = (current as any)(context, nextFunc);
                    if (process.env.NODE_ENV !== "production") {
                        if (res === undefined || res.toString() !== "[object Promise]")
                            throw new TypeError(`${pipeLineName} must return a Promise`);
                    }
                    return res;
                };
                i--;
            }
        }
        return next;
    }
}