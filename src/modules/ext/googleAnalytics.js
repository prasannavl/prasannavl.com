/* global ga */
export function init(id) {
    if (__DOM__) {
        window.ga = window.ga || function () { (ga.q = ga.q || []).push(arguments) }; ga.l = +new Date;
        ga('create', id, 'none');
    }
}

export function pageView(path) {
    if (__DOM__) {
        let args = ["send", "pageview"];
        if (path != null) args.push(path);
        ga.apply(null, args);
    }
}