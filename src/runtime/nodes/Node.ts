import Base from "./Base";
import Stage from "tree2d/dist/tree/Stage";
import Element from "tree2d/dist/tree/Element";
import { eventTranslators, SupportedEvents, VugelEvent, VugelEventListener } from "../../events";
import { VugelMouseEvent } from "../../events/mouseEvents";
import { VugelTouchEvent } from "../../events/touchEvents";

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

export default class Node extends Base {
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
                currentTarget: this,
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

    get nodeEvents(): NodeEvents {
        if (!this._nodeEvents) {
            this._nodeEvents = {};
        }
        return this._nodeEvents;
    }

    set nodeEvents(value: NodeEvents) {
        this._nodeEvents = value;
    }

    set onActive(v: any) {
        if (v === undefined || isFunction(v)) {
            this.el.onActive = v;
        }
    }

    set x(v: any) {
        this.el.x = ensureFloat(v);
    }

    set y(v: any) {
        this.el.y = ensureFloat(v);
    }

    set scale(v: any) {
        this.scaleX = ensureFloat(v);
        this.scaleY = ensureFloat(v);
    }

    set scaleX(v: number) {
        this.el.scaleX = ensureFloat(v);
    }

    set scaleY(v: number) {
        this.el.scaleY = ensureFloat(v);
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

    set color(v: number) {
        this.el.color = ensureInt(v);
    }

    set w(v: number) {
        this.el.w = ensureFloat(v);
    }

    set h(v: number) {
        this.el.h = ensureFloat(v);
    }

    // Setters for NodeEvents

    // MouseEvent
    set onAuxclick(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onAuxclick = e;
    }

    set onClick(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onClick = e;
    }

    set onContextmenu(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onContextmenu = e;
    }

    set onDblclick(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onDblclick = e;
    }

    set onMousedown(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMousedown = e;
    }

    set onMouseenter(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMouseenter = e;
    }

    set onMouseleave(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMouseleave = e;
    }

    set onMousemove(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMousemove = e;
    }

    set onMouseout(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMouseout = e;
    }

    set onMouseover(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMouseover = e;
    }

    set onMouseup(e: VugelEventListener<VugelMouseEvent>) {
        this.nodeEvents.onMouseup = e;
    }

    // TouchEvent
    set onTouchcancel(e: VugelEventListener<VugelTouchEvent>) {
        this.nodeEvents.onTouchcancel = e;
    }

    set onTouchend(e: VugelEventListener<VugelTouchEvent>) {
        this.nodeEvents.onTouchend = e;
    }

    set onTouchmove(e: VugelEventListener<VugelTouchEvent>) {
        this.nodeEvents.onTouchmove = e;
    }

    set onTouchstart(e: VugelEventListener<VugelTouchEvent>) {
        this.nodeEvents.onTouchstart = e;
    }
}

export function ensureInt(v: any): number {
    return parseInt(v as any) || 0;
}

export function ensureFloat(v: any): number {
    return parseFloat(v as any) || 0.0;
}

export function ensureBoolean(v: any): boolean {
    return v !== "false" && !!v;
}

const isFunction = (val: unknown): val is Function => typeof val === "function";
