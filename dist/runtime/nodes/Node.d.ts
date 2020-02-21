import Base from './Base';
export default class Node extends Base {
    readonly stage: typeof lng.Stage;
    constructor(stage: typeof lng.Stage, base?: typeof lng.Element);
    appendChild(child: Base): void;
    removeChild(child: Base): void;
    insertBefore(child: Base, anchor: Base): void;
    /**
     * Returns the nearest base that has an element.
     * @param anchor
     */
    private getBaseAnchor;
    clearChildren(): void;
    onActive: any;
    x: any;
    y: any;
    scale: any;
    scaleX: number;
    scaleY: number;
    rotation: number;
    alpha: number;
    visible: boolean;
    color: number;
    w: number;
    h: number;
}
export declare function ensureInt(v: any): number;
export declare function ensureFloat(v: any): number;
export declare function ensureBoolean(v: any): boolean;
