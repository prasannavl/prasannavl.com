import Rx from "rxjs";

export class Events {
    private _scrollStopSubject = new Rx.Subject<any>()
    public scrollStopObservable = this._scrollStopSubject.asObservable();

    constructor() {

    }

    run() {
        if (__DOM__)
        setInterval(() => {
        this._scrollStopSubject.next(Date.now());
        }, 2000);
    }
}