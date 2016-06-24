import { DomUtils } from "../utils/index";

var CLASSNAMES = {
    element: "scroll-view",
    verticalScrollbar: "scrollbar -vertical",
    horizontalScrollbar: "scrollbar -horizontal",
    thumb: "scrollbar-thumb",
    target: "scroll-target",
    autoshow: "scroll-autoshow",
    disable: "scroll-disable-selection",
    native: "scroll-view-native",
};

export default class CustomScroller {
    constructor(config) {
        this.element = null;
        this.autoshow = false;
        this.createElements = true;
        this.forceCustom = false;
        this.forceNative = false;

        Object.assign(this, config);

        if (CustomScroller.scrollbarWidth === null) {
            CustomScroller.scrollbarWidth = DomUtils.getScrollbarWidth();
        }
        this._useNative = ((CustomScroller.scrollbarWidth === 0) && (this.forceCustom === false)) || this.forceNative;

        this._cache = { events: {} };
        this._created = false;
        this._cursorDown = false;
        this._prevPageX = 0;
        this._prevPageY = 0;

        this._document = null;
        this._window = null;

        this._targetElement = null;

        this._scrollbarVerticalElement = null;
        this._scrollbarHorizontalElement = null;
        
        this._thumbVerticalElement = null;
        this._thumbHorizontalElement = null;
    }


    create() {
        if (this._useNative) {
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
            this._targetElement = document.createElement("div");
            this._scrollbarVerticalElement = document.createElement("div");
            this._thumbVerticalElement = document.createElement("div");
            this._scrollbarHorizontalElement = document.createElement("div");
            this._thumbHorizontalElement = document.createElement("div");
            while (this.element.childNodes.length > 0) {
                this._targetElement.appendChild(this.element.childNodes[0]);
            }
            this._scrollbarVerticalElement.appendChild(this._thumbVerticalElement);
            this._scrollbarHorizontalElement.appendChild(this._thumbHorizontalElement);
            this.element.appendChild(this._scrollbarVerticalElement);
            this.element.appendChild(this._scrollbarHorizontalElement);
            this.element.appendChild(this._targetElement);

            DomUtils.addClass(this._targetElement, CLASSNAMES.target);
            DomUtils.addClass(this._scrollbarVerticalElement, ...CLASSNAMES.verticalScrollbar.split(/\s/));
            DomUtils.addClass(this._scrollbarHorizontalElement, ...CLASSNAMES.horizontalScrollbar.split(/\s/));
            DomUtils.addClass(this._thumbVerticalElement, CLASSNAMES.thumb);
            DomUtils.addClass(this._thumbHorizontalElement, CLASSNAMES.thumb);

        } else {
            this._targetElement = this.element.querySelector("." + CLASSNAMES.target);
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
        if (this._useNative) {
            return this;
        }

        if (this._created === false) {
            console.warn("calling on a not-yet-created object");
            return this;
        }

        let targetElement = this._targetElement;
        targetElement.style.width = "";
        targetElement.style.height = "";
        
        var viewWidth = this.element.offsetWidth + CustomScroller.scrollbarWidth;
        var viewHeight = this.element.offsetHeight + CustomScroller.scrollbarWidth;

        targetElement.style.width = viewWidth.toString() + "px";
        targetElement.style.height = viewHeight.toString() + "px";

        this._updateThumbSize();
        this._updateThumbLayout();

        return this;
    }

    destroy() {
        if (this._useNative) {
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
            while (this._targetElement.childNodes.length > 0) {
                this.element.appendChild(this._targetElement.childNodes[0]);
            }
            this.element.removeChild(this._targetElement);
        } else {
            this._targetElement.style.width = "";
            this._targetElement.style.height = "";
            this._scrollbarVerticalElement.style.display = "none";
            this._scrollbarHorizontalElement.style.display = "none";
        }

        this._created = false;
        this._document = null;

        return null;
    }

    getViewElement() {
        return this._targetElement;
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

        this._targetElement.addEventListener("scroll", this._cache.events.scrollHandler);
        this._scrollbarVerticalElement.addEventListener("mousedown", this._cache.events.clickVerticalTrackHandler);
        this._scrollbarHorizontalElement.addEventListener("mousedown", this._cache.events.clickHorizontalTrackHandler);
        this._thumbVerticalElement.addEventListener("mousedown", this._cache.events.clickVerticalThumbHandler);
        this._thumbHorizontalElement.addEventListener("mousedown", this._cache.events.clickHorizontalThumbHandler);
        this._document.addEventListener("mouseup", this._cache.events.mouseUpDocumentHandler);
        this._window.addEventListener("resize", this._cache.events.resizeHandler);

        return this;
    }

    _unbinEvents() {
        this._targetElement.removeEventListener("scroll", this._cache.events.scrollHandler);
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
        this._updateThumbLayout();
    }

    _updateThumbSize() {
        let heightPercentage, widthPercentage;
        heightPercentage = (this._targetElement.clientHeight * 100 / this._targetElement.scrollHeight);
        widthPercentage = (this._targetElement.clientWidth * 100 / this._targetElement.scrollWidth);

        this._thumbVerticalElement.style.height = (heightPercentage < 100) ? (heightPercentage + "%") : "";
        this._thumbHorizontalElement.style.width = (widthPercentage < 100) ? (widthPercentage + "%") : "";
    }

    _updateThumbLayout() {
        let targetElement, x, y;

        targetElement = this._targetElement;
        y = ((targetElement.scrollTop * 100) / targetElement.clientHeight);
        x = ((targetElement.scrollLeft * 100) / targetElement.clientWidth);

        let translateY = `translateY(${y}%)`;
        let translateX = `translateX(${x}%)`;

        this._thumbVerticalElement.style.msTransform = translateY;
        this._thumbVerticalElement.style.webkitTransform = translateY;
        this._thumbVerticalElement.style.transform = translateY;

        this._thumbHorizontalElement.style.msTransform = translateX;
        this._thumbHorizontalElement.style.webkitTransform = translateX;
        this._thumbHorizontalElement.style.transform = translateX;
    }

    _resizeHandler() {
        this.update();
    }

    _clickVerticalTrackHandler(e) {
        let offset = Math.abs(e.target.getBoundingClientRect().top - e.clientY)
            , thumbHalf = (this._thumbVerticalElement.offsetHeight / 2)
            , thumbPositionPercentage = ((offset - thumbHalf) * 100 / this._scrollbarVerticalElement.offsetHeight);
        this._targetElement.scrollTop = (thumbPositionPercentage * this._targetElement.scrollHeight / 100);
    }

    _clickHorizontalTrackHandler(e) {
        let offset = Math.abs(e.target.getBoundingClientRect().left - e.clientX)
            , thumbHalf = (this._thumbHorizontalElement.offsetWidth / 2)
            , thumbPositionPercentage = ((offset - thumbHalf) * 100 / this._scrollbarHorizontalElement.offsetWidth);
        this._targetElement.scrollLeft = (thumbPositionPercentage * this._targetElement.scrollWidth / 100);
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

        let offset, thumbClickPosition, thumbPositionPercentage;

        if (this._prevPageY) {
            offset = ((this._scrollbarVerticalElement.getBoundingClientRect().top - e.clientY) * -1);
            thumbClickPosition = (this._thumbVerticalElement.offsetHeight - this._prevPageY);
            thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this._scrollbarVerticalElement.offsetHeight);
            this._targetElement.scrollTop = (thumbPositionPercentage * this._targetElement.scrollHeight / 100);
            return void 0;
        }

        if (this._prevPageX) {
            offset = ((this._scrollbarHorizontalElement.getBoundingClientRect().left - e.clientX) * -1);
            thumbClickPosition = (this._thumbHorizontalElement.offsetWidth - this._prevPageX);
            thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this._scrollbarHorizontalElement.offsetWidth);
            this._targetElement.scrollLeft = (thumbPositionPercentage * this._targetElement.scrollWidth / 100);
        }
    }
}

CustomScroller.scrollbarWidth = null;
