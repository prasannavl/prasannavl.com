import { StringUtils } from "./CoreUtils";

export class DomUtils {
    static cache: any = {};

    static shouldDispatchDefaultClickEvent(e: MouseEvent | React.MouseEvent<any>): boolean {
        return (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
    }

    static tryRemoveElement(element: HTMLElement) {
        if (!element) return;
        if (element.remove != null) {
            element.remove();
        } else {
            element.parentNode.removeChild(element);
        }
    }

    static addClass(element: HTMLElement, ...className: string[]) {
        if (!element) return;
        if (element.classList) return element.classList.add(...className);
        else {
            element.className = StringUtils.joinWithSpaceIfNotEmpty(element.className, className.join(" "));
        }
    }

    static removeClass(element: HTMLElement, ...className: string[]) {
        if (!element) return;
        if (element.classList) return element.classList.remove(...className);
        else {
            element.className = element.className.replace(new RegExp('(^|\\b)' + className.join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    static getScrollbarWidth(forceRecheck = false) {
        let cache = DomUtils.cache;
        if (!forceRecheck && cache.scrollbarWidth != null) {
            return cache.scrollbarWidth;
        }
        var e = document.createElement("div"), sw: number;
        e.style.position = "absolute";
        e.style.top = "-9999px";
        e.style.width = "100px";
        e.style.height = "100px";
        e.style.overflow = "scroll";
        e.style.msOverflowStyle = "scrollbar";
        document.body.appendChild(e);
        sw = (e.offsetWidth - e.clientWidth);
        document.body.removeChild(e);
        cache.scrollbarWidth = sw;
        return sw;
    }
}