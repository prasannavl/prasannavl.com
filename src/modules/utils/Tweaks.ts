export class Tweaks {
    static iPadDisableZoom() {
        if (__DOM__) {
            if (navigator.userAgent.match(/iPad/i)) {
                let viewportMeta = document.head.querySelector("meta[name='viewport']") as any;
                if (viewportMeta) {
                    viewportMeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0, initial-scale=1.0";
                }
            }
        }
    }
}