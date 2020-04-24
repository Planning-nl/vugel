import { Base } from "./Base";
import { Element, RelativeFunction } from "tree2d";
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
} from "tree2d";
import { VugelStage } from "../../wrapper";
import { ensureBoolean, ensureColor, ensureFloat, isString } from "../utils/TypeUtils";

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
    private pointerEvents: boolean | undefined = undefined;

    constructor(stage: VugelStage, base?: Element) {
        super(base || new Element(stage));
        this.stage = stage;
        if (this.element) {
            this.element.data = this;
        }
    }

    getParentNode(): Node | undefined {
        let current = this.parent;
        while (current && !(current as any).el) {
            current = current.parent;
        }
        return current as Node;
    }

    get el(): Element {
        return this.element!;
    }

    public set "pointer-events"(v: boolean | undefined) {
        this.pointerEvents = v;
    }

    public capturePointerEvents(): boolean {
        return this.pointerEvents || (this.pointerEvents === undefined && this.getParentCapturePointerEvents());
    }

    private getParentCapturePointerEvents() {
        const parentNode = this.getParentNode();
        return parentNode ? parentNode.capturePointerEvents() : true;
    }

    // Returns the element containing the texture. Texture clipping and tinting will be applied to this element.
    get textureElement(): Element {
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

    // Converts the world (canvas) coordinates to an offset w.r.t. to this Node
    getLocalOffset(worldX: number, worldY: number) {
        return this.el.core.convertWorldCoordsToLocal(worldX, worldY);
    }

    set x(v: number) {
        this.el.x = ensureFloat(v);
    }

    set "func-x"(v: RelativeFunction | string | undefined) {
        this.el.funcX = ensureRelativeFunction(v);
    }

    set y(v: number) {
        this.el.y = v;
    }

    set "func-y"(v: RelativeFunction | string | undefined) {
        this.el.funcY = ensureRelativeFunction(v);
    }

    set w(v: number) {
        this.el.w = v;
    }

    set "func-w"(v: RelativeFunction | string | undefined) {
        this.el.funcW = ensureRelativeFunction(v);
    }

    set h(v: number) {
        this.el.h = v;
    }

    set "func-h"(v: RelativeFunction | string | undefined) {
        this.el.funcH = ensureRelativeFunction(v);
    }

    set "scale-x"(v: number) {
        this.el.scaleX = ensureFloat(v);
    }

    set "scale-y"(v: number) {
        this.el.scaleY = ensureFloat(v);
    }

    set scale(v: any) {
        this.el.scale = ensureFloat(v);
    }

    set "pivot-x"(v: number) {
        this.el.pivotX = ensureFloat(v);
    }

    set "pivot-y"(v: number) {
        this.el.pivotY = ensureFloat(v);
    }

    set pivot(v: any) {
        this.el.pivot = ensureFloat(v);
    }

    set "mount-x"(v: number) {
        this.el.mountX = ensureFloat(v);
    }

    set "mount-y"(v: number) {
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

    set "color-upper-left"(v: number | string) {
        this.textureElement.colorUl = ensureColor(v);
    }

    set "color-upper-right"(v: number | string) {
        this.textureElement.colorUr = ensureColor(v);
    }

    set "color-bottom-left"(v: number | string) {
        this.textureElement.colorUl = ensureColor(v);
    }

    set "color-bottom-right"(v: number | string) {
        this.textureElement.colorUr = ensureColor(v);
    }

    set "color-top"(v: number | string) {
        this.textureElement.colorTop = ensureColor(v);
    }

    set "color-bottom"(v: number | string) {
        this.textureElement.colorBottom = ensureColor(v);
    }

    set "color-left"(v: number | string) {
        this.textureElement.colorLeft = ensureColor(v);
    }

    set "color-right"(v: number | string) {
        this.textureElement.colorRight = ensureColor(v);
    }

    set color(v: number | string) {
        this.textureElement.color = ensureColor(v);
    }

    set "clip-x"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.x = v;
        }
    }

    set "clip-y"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.y = v;
        }
    }

    set "clip-w"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.w = v;
        }
    }

    set "clip-h"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.h = v;
        }
    }

    set "pixel-ratio"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.pixelRatio = ensureFloat(v);
        }
    }

    set "z-index"(v: number) {
        this.el.zIndex = ensureFloat(v);
    }

    set "bounds-margin"(v: number) {
        this.el.boundsMargin = ensureFloat(v);
    }

    set "bounds-marginleft"(v: number) {
        this.el.boundsMarginLeft = ensureFloat(v);
    }

    set "bounds-margin-top"(v: number) {
        this.el.boundsMarginTop = ensureFloat(v);
    }

    set "bounds-margin-right"(v: number) {
        this.el.boundsMarginRight = ensureFloat(v);
    }

    set "bounds-margin-bottom"(v: number) {
        this.el.boundsMarginBottom = ensureFloat(v);
    }

    set "flex-item"(v: boolean) {
        this.el.flexItem = ensureBoolean(v);
    }

    set "flex-grow"(v: number) {
        this.el.flexGrow = ensureFloat(v);
    }

    set "flex-shrink"(v: number) {
        this.el.flexShrink = ensureFloat(v);
    }

    set "flex-align-self"(v: "flex-start" | "flex-end" | "center" | "stretch" | undefined) {
        this.el.flexAlignSelf = v;
    }

    set margin(v: number) {
        this.el.margin = ensureFloat(v);
    }

    set "margin-left"(v: number) {
        this.el.marginLeft = ensureFloat(v);
    }

    set "margin-right"(v: number) {
        this.el.marginRight = ensureFloat(v);
    }

    set "margin-top"(v: number) {
        this.el.marginTop = ensureFloat(v);
    }

    set "margin-bottom"(v: number) {
        this.el.marginBottom = ensureFloat(v);
    }

    set "min-width"(v: number) {
        this.el.minWidth = ensureFloat(v);
    }

    set "min-height"(v: number) {
        this.el.minHeight = ensureFloat(v);
    }

    set "max-width"(v: number) {
        this.el.maxWidth = ensureFloat(v);
    }

    set "max-height"(v: number) {
        this.el.maxHeight = ensureFloat(v);
    }

    set "skip-in-layout"(v: boolean) {
        this.el.skipInLayout = ensureBoolean(v);
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

function ensureRelativeFunction(v: RelativeFunction | string | undefined) {
    if (isString(v)) {
        // Convert to function.
        return convertRelativeFunction(v);
    } else {
        return v;
    }
}

// We hold a cache because string-based vue properties will otherwise result in a new relative function on every vnode
//  update, with performance implications.
const cachedRelFunctions = new Map<string, RelativeFunction>();
function convertRelativeFunction(body: string): RelativeFunction {
    let fn = cachedRelFunctions.get(body);
    if (!fn) {
        fn = new Function("w", "h", `return ${body}`) as RelativeFunction;
        cachedRelFunctions.set(body, fn);
    }
    return fn;
}
