/* eslint-disable camelcase */
/* global DISQUS */
export function loadComments(path, title = null) {
    if (__DEV__) {
        window.disqus_developer = 1;
    }

    function configFactory() {
        this.page.identifier = path;
        if (title) this.page.title = title;
        this.page.url = path;
    }

    try {
        const domain = "http://www.prasannavl.com";
        let canonicalPath = domain + "/" + path;
        if (!window.disqus_config) {
            window.disqus_config = configFactory;
            (function () {
                var d = document,
                    s = d.createElement('script');
                s.src = '//prasannavl.disqus.com/embed.js';
                s.setAttribute('data-timestamp', +new Date());
                (d.head || d.body).appendChild(s);
            })();
        } else {
            DISQUS.reset({
                reload: true,
                config: configFactory
            });
        }
    } catch (err) {
        console.warn("ext: disqus: " + err);
    }
}