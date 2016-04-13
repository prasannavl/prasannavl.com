export type IRendererState = IDomRendererState | IHeadlessRendererState;

export interface IDomRendererState {
    renderSurface: HTMLElement;
}

export interface IHeadlessRendererState {
    statusCode: number;
    error: any;
    data: string;
    isPrerenderedDom: boolean;
    cssModules: CssStyle.CssModule[];
    htmlConfig: any;
}

export class RendererStateFactory {
    static create(): IRendererState {
        if (__DOM__) {
            return { renderSurface: null } as IDomRendererState;
        }
        else {
            return { data: null, isPrerenderedDom: false, error: null, statusCode: 0, cssModules: [], htmlConfig: null } as IHeadlessRendererState;
        }
    }
}