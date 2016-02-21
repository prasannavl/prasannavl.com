import { sprintf } from "sprintf-js";

const CHARSET = "charset";
const DESC = "description";

export default class HeadBuilder {

    constructor() {

        this._namedValues = {};
        this._tags = [];
        this._titleTemplate = null;
        this._title = null;

        this.FormatType = {
            CHARSET: 0,
            DESC: 1,
            JS: 2,
            CSS: 3,
            META_KV: 4,
            META_KVOBJ: 5,
            TITLE: 6,
        }
    }

    _format(type, ...values) {
        switch (type) {
            case this.FormatType.META_KV:
                return "<meta " + values[0] + "=\"" + values[1] + "\">";
            case this.FormatType.META_KVOBJ:
                {
                    let o = values[0];
                    let keys = Object.keys(o);
                    let s = "<meta";
                    keys.forEach(x => {
                        s += " " + x;
                        let val = o[x];
                        if (val) { s += "=\"" + val + "\"" }
                    });
                    s += ">";
                    return s;
                }
            case this.FormatType.JS:
                return "<script src=\"" + values[0] + "\"></script>";
            case this.FormatType.CSS:
                return "<link rel=\"stylesheet\" href=\"" + values[0] + "\">";
            case this.FormatType.TITLE:
                return "<title>" + values[0] + "</title>";
            default:
                return sprintf(type, ...values);
        }
    }

    setDescription(value) {
        this._namedValues[DESC] = value;
    }

    setCharset(value) {
        this._namedValues[CHARSET] = value;
    }

    setTitleTemplate(value) {
        this._titleTemplate = value;
    }

    setTitle(...values) {
        let template = this._titleTemplate || "%s";
        this._title = sprintf(template, ...values);
    }

    getTitle() {
        return this._title;
    }

    addMeta(key, value) {
        if (key && value) {
            this._tags.push(this._format(this.FormatType.META_KV, key, value));
        }
        else if (key) {
            let o = {};
            o[key] = null;
            this.addMetaObject(o);
        }
    }

    addMetaObject(keyValuedObject) {
        if (keyValuedObject) this._tags.push(this._format(this.FormatType.META_KVOBJ, keyValuedObject));
    }

    add(rawString) {
        if (rawString) this._tags.push(rawString);
    }

    addJs(path) {
        if (path) this._tags.push(this._format(this.FormatType.JS, path));
    }

    addCss(path) {
        if (path) this._tags.push(this._format(this.FormatType.CSS, path));
    }

    toString() {
        var s = "";
        [CHARSET, DESC].forEach(x => {
            if (this._namedValues[x]) {
                s += this._format(this.FormatType.META_KV, x, this._namedValues[x]);
            }
        });
        let title = this.getTitle();
        if (title) { s += this._format(this.FormatType.TITLE, title); }
        this._tags.forEach(x => { s += x; });
        return s;
    }
}