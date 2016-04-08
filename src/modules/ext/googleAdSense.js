export function show() {
    if (__DOM__) {
        try {
            const gAdsClassKey = "_g-ads";
            let head = document.head;
            let tags = Array.from(head.getElementsByClassName(gAdsClassKey));
            tags.forEach(x => document.head.removeChild(x));
            let tag = document.createElement("script");
            tag.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
            tag.className = gAdsClassKey;
            head.appendChild(tag);
            let data = window.adsbygoogle;
            if (!data) {
                window.adsbygoogle = data = [];
            }
            data.push({});
        } catch (err) { 
            console.warn("ext: google-adsense: " + err);
        }
    }
}