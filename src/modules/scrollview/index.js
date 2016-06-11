import { DomUtils } from "../utils/index";

var CLASSNAMES = {
    element: "scroll-container",
    verticalScrollbar: "scrollbar -vertical",
    horizontalScrollbar: "scrollbar -horizontal",
    thumb: "thumb",
    target: "scroll-target",
    autoshow: "scroll-autoshow",
    disable: "scroll-disable-selection",
    native: "scroll-native",
};

export default class ScrollView {
    constructor(config) {
        this.element = null;
        this.autoshow = false;
        this.createElements = true;
        this.forceCustom = false;

        Object.keys(config || {}).forEach(function (propertyName) {
            this[propertyName] = config[propertyName];
        }, this);

        if (ScrollView.scrollbarWidth === null) {
            ScrollView.scrollbarWidth = DomUtils.getScrollbarWidth();
        }
        this.noCustom = ((ScrollView.scrollbarWidth === 0) && (this.forceCustom === false));

        this._cache = { events: {} };
        this._created = false;
        this._cursorDown = false;
        this._prevPageX = 0;
        this._prevPageY = 0;

        this._document = null;
        this._window = null;
        this._viewElement = null;
        this._scrollbarVerticalElement = null;
        this._thumbVerticalElement = null;
        this._scrollbarHorizontalElement = null;
        this._scrollbarHorizontalElement = null;
    }


    create() {
        if (this.noCustom) {
            DomUtils.addClass(this.element, CLASSNAMES.native);
            return this;
        }

        if (this._created === true) {
            console.warn("calling on a already-created object");
            return this;
        }

        if (this.autoshow) {
            DomUtils.addClass(this.element, CLASSNAMES.autoshow);
        }

        this._document = document;
        this._window = window;

        if (this.createElements === true) {
            this._viewElement = document.createElement("div");
            this._scrollbarVerticalElement = document.createElement("div");
            this._thumbVerticalElement = document.createElement("div");
            this._scrollbarHorizontalElement = document.createElement("div");
            this._thumbHorizontalElement = document.createElement("div");
            while (this.element.childNodes.length > 0) {
                this._viewElement.appendChild(this.element.childNodes[0]);
            }
            this._scrollbarVerticalElement.appendChild(this._thumbVerticalElement);
            this._scrollbarHorizontalElement.appendChild(this._thumbHorizontalElement);
            this.element.appendChild(this._scrollbarVerticalElement);
            this.element.appendChild(this._scrollbarHorizontalElement);
            this.element.appendChild(this._viewElement);

            DomUtils.addClass(this._viewElement, CLASSNAMES.target);
            DomUtils.addClass(this._scrollbarVerticalElement, ...CLASSNAMES.verticalScrollbar.split(/\s/));
            DomUtils.addClass(this._scrollbarHorizontalElement, ...CLASSNAMES.horizontalScrollbar.split(/\s/));
            DomUtils.addClass(this._thumbVerticalElement, CLASSNAMES.thumb);
            DomUtils.addClass(this._thumbHorizontalElement, CLASSNAMES.thumb);

        } else {
            this._viewElement = this.element.querySelector("." + CLASSNAMES.target);
            this._scrollbarVerticalElement = this.element.querySelector("." + CLASSNAMES.verticalScrollbar.split(" ").join("."));
            this._thumbVerticalElement = this._scrollbarVerticalElement.querySelector("." + CLASSNAMES.thumb);
            this._scrollbarHorizontalElement = this.element.querySelector("." + CLASSNAMES.horizontalScrollbar.split(" ").join("."));
            this._thumbHorizontalElement = this._scrollbarHorizontalElement.querySelector("." + CLASSNAMES.thumb);
        }

        DomUtils.addClass(this.element, CLASSNAMES.element);
        this._scrollbarVerticalElement.style.display = "";
        this._scrollbarHorizontalElement.style.display = "";

        this._created = true;
        return this._bindEvents().update();
    }

    update() {
        if (this.noCustom) {
            return this;
        }

        if (this._created === false) {
            console.warn("calling on a not-yet-created object");
            return this;
        }

        var heightPercentage, widthPercentage;
        this._viewElement.style.width = "";
        this._viewElement.style.height = "";

        var viewWidth = this.element.offsetWidth + ScrollView.scrollbarWidth;
        var viewHeight = this.element.offsetHeight + ScrollView.scrollbarWidth;

        this._viewElement.style.width = viewWidth.toString() + "px";
        this._viewElement.style.height = viewHeight.toString() + "px";

        heightPercentage = (this._viewElement.clientHeight * 100 / this._viewElement.scrollHeight);
        widthPercentage = (this._viewElement.clientWidth * 100 / this._viewElement.scrollWidth);

        this._thumbVerticalElement.style.height = (heightPercentage < 100) ? (heightPercentage + "%") : "";
        this._thumbHorizontalElement.style.width = (widthPercentage < 100) ? (widthPercentage + "%") : "";

        this._scrollHandler();

        return this;
    }

    destroy() {
        if (this.noCustom) {
            return this;
        }

        if (this._created === false) {
            console.warn("calling on a not-yet-created object");
            return this;
        }

        this._unbinEvents();

        DomUtils.removeClass(this.element, CLASSNAMES.element, CLASSNAMES.autoshow);

        if (this.createElements === true) {
            this.element.removeChild(this._scrollbarVerticalElement);
            this.element.removeChild(this._scrollbarHorizontalElement);
            while (this._viewElement.childNodes.length > 0) {
                this.element.appendChild(this._viewElement.childNodes[0]);
            }
            this.element.removeChild(this._viewElement);
        } else {
            this._viewElement.style.width = "";
            this._viewElement.style.height = "";
            this._scrollbarVerticalElement.style.display = "none";
            this._scrollbarHorizontalElement.style.display = "none";
        }

        this._created = false;
        this._document = null;

        return null;
    }

    getViewElement() {
        return this._viewElement;
    }

    _bindEvents() {
        this._cache.events.scrollHandler = this._scrollHandler.bind(this);
        this._cache.events.clickVerticalTrackHandler = this._clickVerticalTrackHandler.bind(this);
        this._cache.events.clickHorizontalTrackHandler = this._clickHorizontalTrackHandler.bind(this);
        this._cache.events.clickVerticalThumbHandler = this._clickVerticalThumbHandler.bind(this);
        this._cache.events.clickHorizontalThumbHandler = this._clickHorizontalThumbHandler.bind(this);
        this._cache.events.mouseUpDocumentHandler = this._mouseUpDocumentHandler.bind(this);
        this._cache.events.mouseMoveDocumentHandler = this._mouseMoveDocumentHandler.bind(this);
        this._cache.events.resizeHandler = this._resizeHandler.bind(this);

        this._viewElement.addEventListener("scroll", this._cache.events.scrollHandler);
        this._scrollbarVerticalElement.addEventListener("mousedown", this._cache.events.clickVerticalTrackHandler);
        this._scrollbarHorizontalElement.addEventListener("mousedown", this._cache.events.clickHorizontalTrackHandler);
        this._thumbVerticalElement.addEventListener("mousedown", this._cache.events.clickVerticalThumbHandler);
        this._thumbHorizontalElement.addEventListener("mousedown", this._cache.events.clickHorizontalThumbHandler);
        this._document.addEventListener("mouseup", this._cache.events.mouseUpDocumentHandler);
        this._window.addEventListener("resize", this._cache.events.resizeHandler);

        return this;
    }

    _unbinEvents() {
        this._viewElement.removeEventListener("scroll", this._cache.events.scrollHandler);
        this._scrollbarVerticalElement.removeEventListener("mousedown", this._cache.events.clickVerticalTrackHandler);
        this._scrollbarHorizontalElement.removeEventListener("mousedown", this._cache.events.clickHorizontalTrackHandler);
        this._thumbVerticalElement.removeEventListener("mousedown", this._cache.events.clickVerticalThumbHandler);
        this._thumbHorizontalElement.removeEventListener("mousedown", this._cache.events.clickHorizontalThumbHandler);
        this._document.removeEventListener("mouseup", this._cache.events.mouseUpDocumentHandler);
        this._document.removeEventListener("mousemove", this._cache.events.mouseMoveDocumentHandler);
        this._window.removeEventListener("resize", this._cache.events.resizeHandler);

        return this;
    }

    _scrollHandler() {
        var viewElement, x, y;

        viewElement = this._viewElement;
        y = ((viewElement.scrollTop * 100) / viewElement.clientHeight);
        x = ((viewElement.scrollLeft * 100) / viewElement.clientWidth);

        this._thumbVerticalElement.style.msTransform = "translateY(" + y + "%)";
        this._thumbVerticalElement.style.webkitTransform = "translateY(" + y + "%)";
        this._thumbVerticalElement.style.transform = "translateY(" + y + "%)";

        this._thumbHorizontalElement.style.msTransform = "translateX(" + x + "%)";
        this._thumbHorizontalElement.style.webkitTransform = "translateX(" + x + "%)";
        this._thumbHorizontalElement.style.transform = "translateX(" + x + "%)";
    }

    _resizeHandler() {
        this.update();
    }

    _clickVerticalTrackHandler(e) {
        var offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY)
            , thumbHalf = (this._thumbVerticalElement.offsetHeight / 2)
            , thumbPositionPercentage = ((offset - thumbHalf) * 100 / this._scrollbarVerticalElement.offsetHeight);
        this._viewElement.scrollTop = (thumbPositionPercentage * this._viewElement.scrollHeight / 100);
    }

    _clickHorizontalTrackHandler(e) {
        var offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX)
            , thumbHalf = (this._thumbHorizontalElement.offsetWidth / 2)
            , thumbPositionPercentage = ((offset - thumbHalf) * 100 / this._scrollbarHorizontalElement.offsetWidth);
        this._viewElement.scrollLeft = (thumbPositionPercentage * this._viewElement.scrollWidth / 100);
    }

    _clickVerticalThumbHandler(e) {
        this._startDrag(e);
        this._prevPageY = (e.currentTarget.offsetHeight - (e.clientY - e.currentTarget.getBoundingClientRect().top));
    }

    _clickHorizontalThumbHandler(e) {
        this._startDrag(e);
        this._prevPageX = (e.currentTarget.offsetWidth - (e.clientX - e.currentTarget.getBoundingClientRect().left));
    }

    _startDrag(e) {
        e.stopImmediatePropagation();
        this._cursorDown = true;
        DomUtils.addClass(document.body, CLASSNAMES.disable);
        this._document.addEventListener("mousemove", this._cache.events.mouseMoveDocumentHandler);
        this._document.onselectstart = function () { return false; };
    }

    _mouseUpDocumentHandler() {
        this._cursorDown = false;
        this._prevPageX = this._prevPageY = 0;
        DomUtils.removeClass(document.body, CLASSNAMES.disable);
        this._document.removeEventListener("mousemove", this._cache.events.mouseMoveDocumentHandler);
        this._document.onselectstart = null;
    }

    _mouseMoveDocumentHandler(e) {
        if (this._cursorDown === false) { return; }

        var offset, thumbClickPosition, thumbPositionPercentage;

        if (this._prevPageY) {
            offset = ((this._scrollbarVerticalElement.getBoundingClientRect().top - e.clientY) * -1);
            thumbClickPosition = (this._thumbVerticalElement.offsetHeight - this._prevPageY);
            thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this._scrollbarVerticalElement.offsetHeight);
            this._viewElement.scrollTop = (thumbPositionPercentage * this._viewElement.scrollHeight / 100);
            return void 0;
        }

        if (this._prevPageX) {
            offset = ((this._scrollbarHorizontalElement.getBoundingClientRect().left - e.clientX) * -1);
            thumbClickPosition = (this._thumbHorizontalElement.offsetWidth - this._prevPageX);
            thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this._scrollbarHorizontalElement.offsetWidth);
            this._viewElement.scrollLeft = (thumbPositionPercentage * this._viewElement.scrollWidth / 100);
        }
    }
}

ScrollView.scrollbarWidth = null;
