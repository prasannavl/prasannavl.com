export class PrerenderHelper {

    constructor(key = "__PRERENDER_DATA__") {
        this.key = key;
        this.dataSourceEnabled = false;
        this.dataSinkEnabled = false;
    }

    getData() {
        return window[this.key];
    }

    destroy() {
        delete window[this.key];
    }

    startDataSource() {
        this.dataSourceEnabled = true;
    }

    startDataSink() {
        this.dataSinkEnabled = true;
    }

    // Calls destroy and sets dataSourceReady to false.
    endDataSource() {
        this.destroy();
        this.dataSourceEnabled = false;
    }

    endDataSink() {
        this.dataSinkEnabled = false;
    }

    // Peeks item from the data object.
    peek(item) {
        let data = this.getData();
        if (data == null)
            return undefined;
        return data[item];
    }

    // Gets the `item` key from data if present,
    // and deletes it from the data object.
    get(item) {
        let data = this.getData();
        if (data == null)
            return undefined;
        let val = data[item];
        delete data[item];
        return val;
    }

    // Adds item to data. Creates data object
    // if it doesn't already exist.
    set(name, value) {
        let data = this.getData();
        if (data == null) {
            data = window[this.key] = {};
        }
        let v = data[name];
        if (v !== undefined) {
            throw new Error("Object already exists. Cannot overwrite");
        }
        data[name] = value;
    }

    snapData() {
        let data = this.getData();
        if (!data) return;
        return {
            [`${this.key}`]: data
        }
    }

    serializeDataToWindow() {
        let data = this.getData();
        serializeDataToWindow(this.key, data);
    }
}

export function serializeDataToWindow(key, data) {
    if (data === undefined && typeof key === "object") {
        let data = key;
        Object.keys(data).map(x => serializeDataToWindow(x, data[x]));
        return;
    }
    let tag = document.createElement("script");
    tag.innerHTML = `window['${key}'] = ${JSON.stringify(data)}`;
    document.body.appendChild(tag);
}