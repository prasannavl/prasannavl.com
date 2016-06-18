/* eslint-disable camelcase */
/* global DISQUS */
export function loadComments(path, title = null) {
    if (__DEV__) {
        window.disqus_developer = 1;
    }
    const domain = "http://www.prasannavl.com";
    let canonicalPath = domain + "/" + path;
    
    function configFactory() {
        this.page.identifier = canonicalPath;
        if (title) this.page.title = title;
        this.page.url = canonicalPath;
    }
    try {
        DISQUS.reset({
            reload: true,
            config: configFactory
        });
    } catch (err) {
        console.warn("ext: disqus: " + err);
    }
}