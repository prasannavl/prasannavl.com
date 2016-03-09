import * as Rx from "rxjs";

export default class {
    private _showExposeStream = new Rx.ReplaySubject<boolean>(1);
    public showExposeStream: Rx.Observable<boolean> = this._showExposeStream.asObservable();

    showExpose() {
        this._showExposeStream.next(true);
    }

    hideExpose() {
        this._showExposeStream.next(false);
    }
}