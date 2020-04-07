import { Base } from "./Base";
import { Stage, Element, FunctionH, FunctionW, FunctionX, FunctionY } from "tree2d/lib";
import {
    eventTranslators,
    SupportedEvents,
    VugelEvent,
    VugelEventListener,
    VugelMouseEvent,
    VugelTouchEvent,
} from "../../events";
import { ElementEventCallback } from "tree2d/lib/tree/ElementListeners";

export type NodeEvents = {
    onAuxclick?: VugelEventListener<VugelMouseEvent>;
    onClick?: VugelEventListener<VugelMouseEvent>;
    onContextmenu?: VugelEventListener<VugelMouseEvent>;
    onDblclick?: VugelEventListener<VugelMouseEvent>;
    onMousedown?: VugelEventListener<VugelMouseEvent>;
    onMouseenter?: VugelEventListener<VugelMouseEvent>;
    onMouseleave?: VugelEventListener<VugelMouseEvent>;
    onMousemove?: VugelEventListener<VugelMouseEvent>;
    onMouseout?: VugelEventListener<VugelMouseEvent>;
    onMouseover?: VugelEventListener<VugelMouseEvent>;
    onMouseup?: VugelEventListener<VugelMouseEvent>;

    onTouchcancel?: VugelEventListener<VugelTouchEvent>;
    onTouchend?: VugelEventListener<VugelTouchEvent>;
    onTouchmove?: VugelEventListener<VugelTouchEvent>;
    onTouchstart?: VugelEventListener<VugelTouchEvent>;
};

export class Node extends Base {
    public readonly stage: Stage;

    public _nodeEvents?: NodeEvents;
    public pointerEvents = true;

    constructor(stage: Stage, base?: Element) {
        super(base || new Element(stage));
        this.stage = stage;
        if (this.element) {
            this.element.data = this;
        }
    }

    get el(): Element {
        return this.element!;
    }

    dispatchVugelEvent(event: VugelEvent<Event>) {
        const vueEventType = eventTranslators[event.type as SupportedEvents];

        const eventHandler = this._nodeEvents?.[vueEventType] as VugelEventListener<any>;
        eventHandler?.({
            ...event,
            currentTarget: this,
        });
    }

    dispatchBubbledEvent(event: VugelEvent<Event>) {
        const vueEventType = eventTranslators[event.type as SupportedEvents];

        let currentNode: Node | undefined = this;
        while (currentNode != undefined) {
            const eventHandler = currentNode._nodeEvents?.[vueEventType] as VugelEventListener<any>;
            const newEvent = {
                ...event,
                currentTarget: currentNode,
            };

            eventHandler?.(newEvent);

            if (newEvent.cancelBubble) {
                return;
            }
            currentNode = currentNode.parentNode as Node | undefined;
        }
    }

    appendChild(child: Base) {
        super.appendChild(child);
        if (child.element) {
            this.el.childList.add(child.element);
        }
    }

    removeChild(child: Base) {
        super.removeChild(child);
        if (child.element) {
            this.el.childList.remove(child.element);
        }
    }

    insertBefore(child: Base, anchor: Base) {
        super.insertBefore(child, anchor);
        const item = child.element;
        if (item) {
            const baseAnchor = this.getBaseAnchor(anchor);
            if (baseAnchor) {
                const insertBefore = baseAnchor.element!;
                const index = this.el.childList.getIndex(insertBefore);
                if (index > 0) {
                    this.el.childList.addAt(item, index);
                } else {
                    throw new Error("Can't find anchor in tree2d child list: " + insertBefore.getLocationString());
                }
            } else {
                this.el.childList.add(item);
            }
        }
    }

    /**
     * Returns the nearest base that has an element.
     * @param anchor
     */
    private getBaseAnchor(anchor: Base): Base | undefined {
        if (anchor.element) {
            return anchor;
        } else {
            // In case of a v-for with a lot of elements, lastIndexOf will perform faster.
            let index = this.children.lastIndexOf(anchor);
            if (index !== -1) {
                const n = this.children.length;
                while (++index < n) {
                    if (this.children[index].element) {
                        return this.children[index];
                    }
                }
            }
            return undefined;
        }
    }

    clearChildren() {
        this.children.forEach((child) => (child.parentNode = undefined));
        this.children = [];
        this.el.childList.clear();
    }

    set x(v: number | FunctionX | string) {
        this.el.x = convertRelValue(v, "w");
    }

    set y(v: number | FunctionY | string) {
        this.el.y = convertRelValue(v, "h");
    }

    set w(v: number | FunctionW | string) {
        this.el.w = convertRelValue(v, "w");
    }

    set h(v: number | FunctionH) {
        this.el.h = convertRelValue(v, "h");
    }

    set scaleX(v: number) {
        this.el.scaleX = ensureFloat(v);
    }

    set scaleY(v: number) {
        this.el.scaleY = ensureFloat(v);
    }

    set scale(v: any) {
        this.el.scale = ensureFloat(v);
    }

    set pivotX(v: number) {
        this.el.pivotX = ensureFloat(v);
    }

    set pivotY(v: number) {
        this.el.pivotY = ensureFloat(v);
    }

    set pivot(v: any) {
        this.el.pivot = ensureFloat(v);
    }

    set mountX(v: number) {
        this.el.mountX = ensureFloat(v);
    }

    set mountY(v: number) {
        this.el.mountY = ensureFloat(v);
    }

    set mount(v: any) {
        this.el.mount = ensureFloat(v);
    }

    set rotation(v: number) {
        this.el.rotation = ensureFloat(v);
    }

    set alpha(v: number) {
        this.el.alpha = ensureFloat(v);
    }

    set visible(v: boolean) {
        this.el.visible = ensureBoolean(v);
    }

    set colorUl(v: number) {
        this.el.colorUl = ensureColor(v);
    }

    set colorUr(v: number) {
        this.el.colorUr = ensureColor(v);
    }

    set colorBl(v: number) {
        this.el.colorUl = ensureColor(v);
    }

    set colorBr(v: number) {
        this.el.colorUr = ensureColor(v);
    }

    set colorTop(v: number) {
        this.el.colorTop = ensureColor(v);
    }

    set colorBottom(v: number) {
        this.el.colorBottom = ensureColor(v);
    }

    set colorLeft(v: number) {
        this.el.colorLeft = ensureColor(v);
    }

    set colorRight(v: number) {
        this.el.colorRight = ensureColor(v);
    }

    set color(v: number) {
        this.el.color = ensureColor(v);
    }

    set zIndex(v: number) {
        this.el.zIndex = ensureFloat(v);
    }

    set forceZIndexContext(v: boolean) {
        this.el.forceZIndexContext = ensureBoolean(v);
    }

    set clipping(v: boolean) {
        this.el.clipping = ensureBoolean(v);
    }

    set boundsMargin(v: number) {
        this.el.boundsMargin = ensureFloat(v);
    }

    set boundsMarginLeft(v: number) {
        this.el.boundsMarginLeft = ensureFloat(v);
    }

    set boundsMarginTop(v: number) {
        this.el.boundsMarginTop = ensureFloat(v);
    }

    set boundsMarginRight(v: number) {
        this.el.boundsMarginRight = ensureFloat(v);
    }

    set boundsMarginBottom(v: number) {
        this.el.boundsMarginBottom = ensureFloat(v);
    }

    set clipbox(v: boolean) {
        this.el.clipbox = ensureBoolean(v);
    }

    set mw(v: number) {
        this.el.mw = ensureFloat(v);
    }

    set mh(v: number) {
        this.el.mh = ensureFloat(v);
    }

    set renderToTexture(v: boolean) {
        this.el.renderToTexture = ensureBoolean(v);
    }

    set renderToTextureLazy(v: boolean) {
        this.el.renderToTextureLazy = ensureBoolean(v);
    }

    set renderToTextureOffscreen(v: boolean) {
        this.el.renderToTextureOffscreen = ensureBoolean(v);
    }

    set renderToTextureColorize(v: boolean) {
        this.el.renderToTextureColorize = ensureBoolean(v);
    }

    set flex(v: boolean) {
        this.el.flex = ensureBoolean(v);
    }

    set flexDirection(v: "row" | "row-reverse" | "column" | "column-reverse") {
        this.el.flexDirection = v;
    }

    set flexWrap(v: boolean) {
        this.el.flexWrap = ensureBoolean(v);
    }

    set flexAlignItems(v: "flex-start" | "flex-end" | "center" | "stretch") {
        this.el.flexAlignItems = v;
    }

    set flexJustifyContent(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly",
    ) {
        this.el.flexJustifyContent = v;
    }

    set flexAlignContent(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "stretch",
    ) {
        this.el.flexAlignContent = v;
    }

    set flexItem(v: boolean) {
        this.el.flexItem = ensureBoolean(v);
    }

    set flexGrow(v: number) {
        this.el.flexGrow = ensureFloat(v);
    }

    set flexShrink(v: number) {
        this.el.flexShrink = ensureFloat(v);
    }

    set flexAlignSelf(v: "flex-start" | "flex-end" | "center" | "stretch" | undefined) {
        this.el.flexAlignSelf = v;
    }

    set padding(v: number) {
        this.el.padding = ensureFloat(v);
    }

    set paddingLeft(v: number) {
        this.el.paddingLeft = ensureFloat(v);
    }

    set paddingRight(v: number) {
        this.el.paddingRight = ensureFloat(v);
    }

    set paddingTop(v: number) {
        this.el.paddingTop = ensureFloat(v);
    }

    set paddingBottom(v: number) {
        this.el.paddingBottom = ensureFloat(v);
    }

    set margin(v: number) {
        this.el.margin = ensureFloat(v);
    }

    set marginLeft(v: number) {
        this.el.marginLeft = ensureFloat(v);
    }

    set marginRight(v: number) {
        this.el.marginRight = ensureFloat(v);
    }

    set marginTop(v: number) {
        this.el.marginTop = ensureFloat(v);
    }

    set marginBottom(v: number) {
        this.el.marginBottom = ensureFloat(v);
    }

    set minWidth(v: number) {
        this.el.minWidth = ensureFloat(v);
    }

    set minHeight(v: number) {
        this.el.minHeight = ensureFloat(v);
    }

    set maxWidth(v: number) {
        this.el.maxWidth = ensureFloat(v);
    }

    set maxHeight(v: number) {
        this.el.maxHeight = ensureFloat(v);
    }

    get nodeEvents(): NodeEvents {
        if (!this._nodeEvents) {
            this._nodeEvents = {};
        }
        return this._nodeEvents;
    }

    set nodeEvents(value: NodeEvents) {
        this._nodeEvents = value;
    }

    // Setters for NodeEvents
    set onSetup(v: ElementEventCallback | undefined) {
        this.el.onSetup = v;
    }

    set onAttach(v: ElementEventCallback | undefined) {
        this.el.onAttach = v;
    }

    set onDetach(v: ElementEventCallback | undefined) {
        this.el.onDetach = v;
    }

    set onEnabled(v: ElementEventCallback | undefined) {
        this.el.onEnabled = v;
    }

    set onDisabled(v: ElementEventCallback | undefined) {
        this.el.onDisabled = v;
    }

    set onActive(v: ElementEventCallback | undefined) {
        this.el.onActive = v;
    }

    set onInactive(v: ElementEventCallback | undefined) {
        this.el.onInactive = v;
    }

    set onTextureError(v: ElementEventCallback | undefined) {
        this.el.onTextureError = v;
    }

    set onTextureLoaded(v: ElementEventCallback | undefined) {
        this.el.onTextureLoaded = v;
    }

    set onTextureUnloaded(v: ElementEventCallback | undefined) {
        this.el.onTextureUnloaded = v;
    }

    set onResize(v: ElementEventCallback | undefined) {
        this.el.onResize = v;
    }

    set onUpdate(v: ElementEventCallback | undefined) {
        this.el.onUpdate = v;
    }

    set onAfterCalcs(v: ElementEventCallback | undefined) {
        this.el.onAfterCalcs = v;
    }

    set onAfterUpdate(v: ElementEventCallback | undefined) {
        this.el.onAfterUpdate = v;
    }

    // MouseEvent
    set onAuxclick(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onAuxclick = e;
    }

    set onClick(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onClick = e;
    }

    set onContextmenu(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onContextmenu = e;
    }

    set onDblclick(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onDblclick = e;
    }

    set onMousedown(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMousedown = e;
    }

    set onMouseenter(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMouseenter = e;
    }

    set onMouseleave(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMouseleave = e;
    }

    set onMousemove(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMousemove = e;
    }

    set onMouseout(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMouseout = e;
    }

    set onMouseover(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMouseover = e;
    }

    set onMouseup(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onMouseup = e;
    }

    // TouchEvent
    set onTouchcancel(e: VugelEventListener<VugelTouchEvent> | undefined) {
        this.nodeEvents.onTouchcancel = e;
    }

    set onTouchend(e: VugelEventListener<VugelTouchEvent> | undefined) {
        this.nodeEvents.onTouchend = e;
    }

    set onTouchmove(e: VugelEventListener<VugelTouchEvent> | undefined) {
        this.nodeEvents.onTouchmove = e;
    }

    set onTouchstart(e: VugelEventListener<VugelTouchEvent> | undefined) {
        this.nodeEvents.onTouchstart = e;
    }
}

export function ensureColor(v: any): number {
    return ensureInt(v);
}

export function ensureInt(v: any): number {
    if (typeof v === "number") {
        return v;
    } else {
        return parseInt(v as any) || 0;
    }
}

export function ensureFloat(v: any): number {
    if (typeof v === "number") {
        return v;
    } else {
        return parseFloat(v as any) || 0.0;
    }
}

export function ensureBoolean(v: any): boolean {
    return v !== "false" && !!v;
}

export function isString(value: any): value is string {
    return typeof value === "string";
}

export function parseFloatStrict(value: string) {
    if (/^(-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) return Number(value);
    return NaN;
}

export function convertRelValue(v: number | RelFunction | string, argName: string) {
    if (isString(v)) {
        const floatValue = parseFloatStrict(v);
        if (isNaN(floatValue)) {
            // Convert to function.
            return convertToRelFunction(v, argName);
        } else {
            return floatValue;
        }
    } else {
        return isFunction(v) ? v : ensureFloat(v);
    }
}

export function convertToRelFunction(body: string, argName: string): RelFunction {
    const key = `${argName}:${body}`;
    return new Function(argName, `return ${body}`) as RelFunction;
}
type RelFunction = (v: number) => number;

const isFunction = (val: unknown): val is Function => typeof val === "function";
