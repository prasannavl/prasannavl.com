/* global ga */
export function init(id) {
    {{window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', id, 'none');}}
}

export function pageView(path) {
    let args = ["send", "pageview"];
    if (path != null) args.push(path);
    ga.apply(null, args);
}