export function show() {
    let head = document.head;
    let tags = Array.from(head.getElementsByClassName("g-ads"));
    tags.forEach(x => x.remove());
    let tag = document.createElement("script");
    tag.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    tag.className = "g-ads";
    head.appendChild(tag);
    let data = window.adsbygoogle;
    if (!data) {
        window.adsbygoogle = data = [];
    }
    data.push({});
}