export class Features {
    static isTouchDevice() {
        return (('ontouchstart' in window) || (window as any).DocumentTouch);
    }
}

export default Features;