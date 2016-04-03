export function loadComments(path) {
    if (__DEV__) {
        window.disqus_developer = 1;
    }
    const domain = "http://www.prasannavl.com";
    let canonicalPath = domain + "/" + path;
    if (!window.disqus_config) {
        window.disqus_config = function() {
            this.page.url = canonicalPath;
            this.page.identifier = canonicalPath;
        };
        (function() {
            var d = document,
                s = d.createElement('script');
            s.src = '//prasannavl.disqus.com/embed.js';
            s.setAttribute('data-timestamp', +new Date());
            (d.head || d.body).appendChild(s);
        })();
    } else {
        DISQUS.reset({
            reload: true,
            config: function() {
                this.page.identifier = canonicalPath;
                this.page.url = canonicalPath;
            }
        });
    }
}