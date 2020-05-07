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

import { VugelStage } from "../../wrapper";
import { ensureBoolean, ensureColor, ensureFloat, isString } from "../utils/TypeUtils";

export {
    VugelNodeEventListener,
    VugelTextureErrorEventListener,
    VugelTextureEventListener,
    VugelResizeEventListener,
    VugelNodeEventObject,
    VugelTextureErrorEventObject,
    VugelTextureEventObject,
    VugelResizeEventObject,
} from "./tree2dEvents";

import {
    VugelNodeEventListener,
    VugelTextureErrorEventListener,
    VugelTextureEventListener,
    VugelResizeEventListener,
    augmentTree2dElementEvent,
} from "./tree2dEvents";

type NodeEvents = {
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

    public _nodeEvents?: NodeEvents = undefined;
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

    get id() {
        return this.el.id;
    }

    set id(v: string | undefined) {
        this.el.id = v;
    }

    get "pointer-events"() {
        return this.pointerEvents;
    }

    set "pointer-events"(v: boolean | undefined) {
        this.pointerEvents = v;
    }

    capturePointerEvents(): boolean {
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

    get x() {
        return this.el.x;
    }

    set x(v: number) {
        this.el.x = ensureFloat(v);
    }

    get "func-x"() {
        return this.el.funcX;
    }

    set "func-x"(v: RelativeFunction | string | undefined) {
        this.el.funcX = ensureRelativeFunction(v);
    }

    get y() {
        return this.el.y;
    }

    set y(v: number) {
        this.el.y = v;
    }

    get "func-y"() {
        return this.el.funcY;
    }

    set "func-y"(v: RelativeFunction | string | undefined) {
        this.el.funcY = ensureRelativeFunction(v);
    }

    get w() {
        return this.el.w;
    }

    set w(v: number) {
        this.el.w = v;
    }

    get "func-w"() {
        return this.el.funcW;
    }

    set "func-w"(v: RelativeFunction | string | undefined) {
        this.el.funcW = ensureRelativeFunction(v);
    }

    get h() {
        return this.el.h;
    }

    set h(v: number) {
        this.el.h = v;
    }

    get "func-h"() {
        return this.el.funcH;
    }

    set "func-h"(v: RelativeFunction | string | undefined) {
        this.el.funcH = ensureRelativeFunction(v);
    }

    get "scale-x"() {
        return this.el.scaleX;
    }

    set "scale-x"(v: number) {
        this.el.scaleX = ensureFloat(v);
    }

    get "scale-y"() {
        return this.el.scaleY;
    }

    set "scale-y"(v: number) {
        this.el.scaleY = ensureFloat(v);
    }

    get scale() {
        return this.el.scale;
    }

    set scale(v: any) {
        this.el.scale = ensureFloat(v);
    }

    get "pivot-x"() {
        return this.el.pivotX;
    }

    set "pivot-x"(v: number) {
        this.el.pivotX = ensureFloat(v);
    }

    get "pivot-y"() {
        return this.el.pivotY;
    }

    set "pivot-y"(v: number) {
        this.el.pivotY = ensureFloat(v);
    }

    get pivot() {
        return this.el.pivot;
    }

    set pivot(v: any) {
        this.el.pivot = ensureFloat(v);
    }

    get "mount-x"() {
        return this.el.mountX;
    }

    set "mount-x"(v: number) {
        this.el.mountX = ensureFloat(v);
    }

    get "mount-y"() {
        return this.el.mountY;
    }

    set "mount-y"(v: number) {
        this.el.mountY = ensureFloat(v);
    }

    get mount() {
        return this.el.mount;
    }

    set mount(v: any) {
        this.el.mount = ensureFloat(v);
    }

    get rotation() {
        return this.el.rotation;
    }

    set rotation(v: number) {
        this.el.rotation = ensureFloat(v);
    }

    get alpha() {
        return this.el.alpha;
    }

    set alpha(v: number) {
        this.el.alpha = ensureFloat(v);
    }

    get visible() {
        return this.el.visible;
    }

    set visible(v: boolean) {
        this.el.visible = ensureBoolean(v);
    }

    get "color-top-left"() {
        return this.textureElement.colorUl;
    }

    set "color-top-left"(v: number | string) {
        this.textureElement.colorUl = ensureColor(v);
    }

    get "color-top-right"() {
        return this.textureElement.colorUr;
    }

    set "color-top-right"(v: number | string) {
        this.textureElement.colorUr = ensureColor(v);
    }

    get "color-bottom-left"() {
        return this.textureElement.colorBl;
    }

    set "color-bottom-left"(v: number | string) {
        this.textureElement.colorBl = ensureColor(v);
    }

    get "color-bottom-right"() {
        return this.textureElement.colorBr;
    }

    set "color-bottom-right"(v: number | string) {
        this.textureElement.colorBr = ensureColor(v);
    }

    get "color-top"() {
        return this.textureElement.colorTop;
    }

    set "color-top"(v: number | string) {
        this.textureElement.colorTop = ensureColor(v);
    }

    get "color-bottom"() {
        return this.textureElement.colorBottom;
    }

    set "color-bottom"(v: number | string) {
        this.textureElement.colorBottom = ensureColor(v);
    }

    get "color-left"() {
        return this.textureElement.colorLeft;
    }

    set "color-left"(v: number | string) {
        this.textureElement.colorLeft = ensureColor(v);
    }

    get "color-right"() {
        return this.textureElement.colorRight;
    }

    set "color-right"(v: number | string) {
        this.textureElement.colorRight = ensureColor(v);
    }

    get color() {
        return this.textureElement.color;
    }

    set color(v: number | string) {
        this.textureElement.color = ensureColor(v);
    }

    get "clip-x"() {
        return this.textureElement.texture?.x || 0;
    }

    set "clip-x"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.x = v;
        }
    }

    get "clip-y"() {
        return this.textureElement.texture?.y || 0;
    }

    set "clip-y"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.y = v;
        }
    }

    get "clip-w"() {
        return this.textureElement.texture?.w || 0;
    }

    set "clip-w"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.w = v;
        }
    }

    get "clip-h"() {
        return this.textureElement.texture?.h || 0;
    }

    set "clip-h"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.h = v;
        }
    }

    get "pixel-ratio"() {
        return this.textureElement.texture?.pixelRatio || 1;
    }

    set "pixel-ratio"(v: number) {
        if (this.textureElement.texture) {
            this.textureElement.texture.pixelRatio = ensureFloat(v);
        }
    }

    get "z-index"() {
        return this.el.zIndex;
    }

    set "z-index"(v: number) {
        this.el.zIndex = ensureFloat(v);
    }

    get "bounds-margin"() {
        return this.el.boundsMargin;
    }

    set "bounds-margin"(v: number | undefined) {
        this.el.boundsMargin = ensureFloat(v);
    }

    get "bounds-margin-left"() {
        return this.el.boundsMarginLeft;
    }

    set "bounds-margin-left"(v: number) {
        this.el.boundsMarginLeft = ensureFloat(v);
    }

    get "bounds-margin-top"() {
        return this.el.boundsMarginTop;
    }

    set "bounds-margin-top"(v: number) {
        this.el.boundsMarginTop = ensureFloat(v);
    }

    get "bounds-margin-right"() {
        return this.el.boundsMarginRight;
    }

    set "bounds-margin-right"(v: number) {
        this.el.boundsMarginRight = ensureFloat(v);
    }

    get "bounds-margin-bottom"() {
        return this.el.boundsMarginBottom;
    }

    set "bounds-margin-bottom"(v: number) {
        this.el.boundsMarginBottom = ensureFloat(v);
    }

    get "flex-item"() {
        return this.el.flexItem;
    }

    set "flex-item"(v: boolean) {
        this.el.flexItem = ensureBoolean(v);
    }

    get "flex-grow"() {
        return this.el.flexGrow;
    }

    set "flex-grow"(v: number) {
        this.el.flexGrow = ensureFloat(v);
    }

    get "flex-shrink"() {
        return this.el.flexShrink;
    }

    set "flex-shrink"(v: number) {
        this.el.flexShrink = ensureFloat(v);
    }

    get "flex-align-self"() {
        return this.el.flexAlignSelf;
    }

    set "flex-align-self"(v: "flex-start" | "flex-end" | "center" | "stretch" | undefined) {
        this.el.flexAlignSelf = v;
    }

    get margin() {
        return this.el.margin;
    }

    set margin(v: number) {
        this.el.margin = ensureFloat(v);
    }

    get "margin-left"() {
        return this.el.marginLeft;
    }

    set "margin-left"(v: number) {
        this.el.marginLeft = ensureFloat(v);
    }

    get "margin-right"() {
        return this.el.marginRight;
    }

    set "margin-right"(v: number) {
        this.el.marginRight = ensureFloat(v);
    }

    get "margin-top"() {
        return this.el.marginTop;
    }

    set "margin-top"(v: number) {
        this.el.marginTop = ensureFloat(v);
    }

    get "margin-bottom"() {
        return this.el.marginBottom;
    }

    set "margin-bottom"(v: number) {
        this.el.marginBottom = ensureFloat(v);
    }

    get "min-width"() {
        return this.el.minWidth;
    }

    set "min-width"(v: number) {
        this.el.minWidth = ensureFloat(v);
    }

    get "min-height"() {
        return this.el.minHeight;
    }

    set "min-height"(v: number) {
        this.el.minHeight = ensureFloat(v);
    }

    get "max-width"() {
        return this.el.maxWidth;
    }

    set "max-width"(v: number) {
        this.el.maxWidth = ensureFloat(v);
    }

    get "max-height"() {
        return this.el.maxHeight;
    }

    set "max-height"(v: number) {
        this.el.maxHeight = ensureFloat(v);
    }

    get "skip-in-layout"() {
        return this.el.skipInLayout;
    }

    set "skip-in-layout"(v: boolean) {
        this.el.skipInLayout = ensureBoolean(v);
    }

    private get nodeEvents(): NodeEvents {
        if (!this._nodeEvents) {
            this._nodeEvents = {};
        }
        return this._nodeEvents;
    }

    // Setters for NodeEvents
    set onSetup(v: VugelNodeEventListener | undefined) {
        this.el.onSetup = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onAttach(v: VugelNodeEventListener | undefined) {
        this.el.onAttach = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onDetach(v: VugelNodeEventListener | undefined) {
        this.el.onDetach = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onEnabled(v: VugelNodeEventListener | undefined) {
        this.el.onEnabled = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onDisabled(v: VugelNodeEventListener | undefined) {
        this.el.onDisabled = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onActive(v: VugelNodeEventListener | undefined) {
        this.el.onActive = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onInactive(v: VugelNodeEventListener | undefined) {
        this.el.onInactive = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onTextureError(v: VugelTextureErrorEventListener | undefined) {
        this.el.onTextureError = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onTextureLoaded(v: VugelTextureEventListener | undefined) {
        this.el.onTextureLoaded = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onTextureUnloaded(v: VugelTextureEventListener | undefined) {
        this.el.onTextureUnloaded = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onResize(v: VugelResizeEventListener | undefined) {
        this.el.onResize = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onUpdate(v: VugelNodeEventListener | undefined) {
        this.el.onUpdate = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onAfterCalcs(v: VugelNodeEventListener | undefined) {
        this.el.onAfterCalcs = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
    }

    set onAfterUpdate(v: VugelNodeEventListener | undefined) {
        this.el.onAfterUpdate = v ? (e) => v(augmentTree2dElementEvent(e)) : undefined;
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

    getLayoutX() {
        return this.el.layoutX;
    }

    getLayoutY() {
        return this.el.layoutY;
    }

    getLayoutW() {
        return this.el.layoutW;
    }

    getLayoutH() {
        return this.el.layoutH;
    }
}

/**
 * Do not proxify Nodes when using template refs.
 * See https://github.com/vuejs/vue-next/pull/1060
 */
(Node.prototype as any)["__v_skip"] = true;

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
