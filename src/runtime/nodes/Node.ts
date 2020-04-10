import { Base } from "./Base";
import { Element, FunctionH, FunctionW, FunctionX, FunctionY } from "tree2d/lib";
import {
    eventTranslators,
    SupportedEvents,
    VugelEvent,
    VugelEventListener,
    VugelFocusEvent,
    VugelKeyboardEvent,
    VugelMouseEvent,
} from "../../events";
import {
    ElementEventCallback,
    ElementResizeEventCallback,
    ElementTextureEventCallback,
    ElementTextureErrorEventCallback,
} from "tree2d/lib/tree/ElementListeners";
import { VugelStage } from "../../wrapper";

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

    onTouchcancel?: VugelEventListener<VugelMouseEvent>;
    onTouchend?: VugelEventListener<VugelMouseEvent>;
    onTouchmove?: VugelEventListener<VugelMouseEvent>;
    onTouchstart?: VugelEventListener<VugelMouseEvent>;

    onFocusin?: VugelEventListener<VugelFocusEvent>;
    onFocusout?: VugelEventListener<VugelFocusEvent>;
    onFocus?: VugelEventListener<VugelFocusEvent>;
    onBlur?: VugelEventListener<VugelFocusEvent>;

    onKeypress?: VugelEventListener<VugelKeyboardEvent>;
    onKeydown?: VugelEventListener<VugelKeyboardEvent>;
    onKeyup?: VugelEventListener<VugelKeyboardEvent>;
};

export class Node extends Base {
    public readonly stage: VugelStage;

    public _nodeEvents?: NodeEvents;
    public pointerEvents = true;

    constructor(stage: VugelStage, base?: Element) {
        super(base || new Element(stage));
        this.stage = stage;
        if (this.element) {
            this.element.data = this;
        }
    }

    get el(): Element {
        return this.element!;
    }

    focus() {
        this.stage.eventHelpers.focusManager.setFocus(this);
    }

    dispatchEvent<T extends Event | undefined>(event: VugelEvent<T>) {
        const vueEventType = eventTranslators[event.type as SupportedEvents];

        const eventHandler = this._nodeEvents?.[vueEventType] as VugelEventListener<any>;
        eventHandler?.({
            ...event,
            currentTarget: this,
        });
    }

    /**
     * Dispatches a bubbled event.
     *
     * @param event the event to be dispatched
     * @param ancestorBubble if you want to fake bubble (for example for a mouseleave event) until a certain ancestor, this field should be used.
     * Note that this will also update the target of the event. When setting it to "true", it will effectively bubble all the way down, though updating the target the entire tree.
     */
    dispatchBubbledEvent<T extends Event | undefined>(
        event: VugelEvent<T>,
        ancestorBubble: Base | true | undefined = undefined,
    ) {
        const vueEventType = eventTranslators[event.type as SupportedEvents];

        let currentNode: Base | undefined = this;
        while (currentNode !== undefined && currentNode !== ancestorBubble) {
            const eventHandler = (currentNode as Node)._nodeEvents?.[vueEventType] as VugelEventListener<any>;
            const newEvent = {
                ...event,
                currentTarget: currentNode,
                target: ancestorBubble !== undefined ? currentNode : event.target,
            };

            eventHandler?.(newEvent);

            if (ancestorBubble !== undefined && newEvent.cancelBubble) {
                return;
            }

            currentNode = currentNode.parent;
        }
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

    set mw(v: number) {
        this.el.mw = ensureFloat(v);
    }

    set mh(v: number) {
        this.el.mh = ensureFloat(v);
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

    set onTextureError(v: ElementTextureErrorEventCallback | undefined) {
        this.el.onTextureError = v;
    }

    set onTextureLoaded(v: ElementTextureEventCallback | undefined) {
        this.el.onTextureLoaded = v;
    }

    set onTextureUnloaded(v: ElementTextureEventCallback | undefined) {
        this.el.onTextureUnloaded = v;
    }

    set onResize(v: ElementResizeEventCallback | undefined) {
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
    set onTouchcancel(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onTouchcancel = e;
    }

    set onTouchend(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onTouchend = e;
    }

    set onTouchmove(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onTouchmove = e;
    }

    set onTouchstart(e: VugelEventListener<VugelMouseEvent> | undefined) {
        this.nodeEvents.onTouchstart = e;
    }

    // FocusEvent
    set onFocusin(e: VugelEventListener<VugelFocusEvent> | undefined) {
        this.nodeEvents.onFocusin = e;
    }

    set onFocusout(e: VugelEventListener<VugelFocusEvent> | undefined) {
        this.nodeEvents.onFocusout = e;
    }

    set onFocus(e: VugelEventListener<VugelFocusEvent> | undefined) {
        this.nodeEvents.onFocus = e;
    }

    set onBlur(e: VugelEventListener<VugelFocusEvent> | undefined) {
        this.nodeEvents.onBlur = e;
    }

    // KeyboardEvent
    set onKeypress(e: VugelEventListener<VugelKeyboardEvent> | undefined) {
        this.nodeEvents.onKeypress = e;
    }

    set onKeydown(e: VugelEventListener<VugelKeyboardEvent> | undefined) {
        this.nodeEvents.onKeydown = e;
    }

    set onKeyup(e: VugelEventListener<VugelKeyboardEvent> | undefined) {
        this.nodeEvents.onKeyup = e;
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
    return new Function(argName, `return ${body}`) as RelFunction;
}

type RelFunction = (v: number) => number;

const isFunction = (val: unknown): val is Function => typeof val === "function";
