export class HighlightJs {
    constructor() {
        this._className = "__hljs__";
        this._isInDom = false;
        this._loaded = false;
        let s = document.createElement("script");
        this._element = s;
        this._cbList = [];
        this._setup();
    }

    _setup() {
        const s = this._element;
        s.className = this._className;
        s.src = "//cdnjs.cloudflare.com/ajax/libs/highlight.js/9.7.0/highlight.min.js";
        s.onreadystatechange = s.onload = () => {
            let state = s.readyState;
            if (!state || state == "loaded" || state == "complete") {
                this._onLoad();
            }
        };
    }

    _queueOnLoadCallback(cb) {
        this._cbList.push(cb);
    }

    _onLoad() {
        this._loaded = true;
        this._cbList.forEach(x => x());
        this._cbList = [];
        this._element.onreadystatechange = this._element.onload = null;
    }

    insertIntoDom() {
        this._isInDom = true;
        var item = document.head.querySelector(`.${this._className}`);
        if (item == null) {
            document.head.appendChild(this._element);
            return;
        }
        let state = item.readyState;
        if (!state || state == "loaded" || state == "complete") {
            this._onLoad();
        } else {
            let prev = item.onreadystatechange;
            item.onreadystatechange = item.onload = () => {
                if (prev) prev();                
                let state = item.readyState;                    
                if (state == "loaded" || state == "complete") {
                    this._onLoad();
                }
            };
        }
    }

    executeInitialized(cb) {
        if (!this._isInDom) {
            this.insertIntoDom();
        }
        if (!this._loaded) {
            this._queueOnLoadCallback(cb);
        } else {
            cb();
        }
    }
}