export class DomUtils {
    static shouldDispatchDefaultClickEvent(e: MouseEvent | __React.MouseEvent): boolean {
        return (e.button !== 0 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey);
    }
}