import Base from "./Base";
import Stage from "tree2d/dist/tree/Stage";
import Element from "tree2d/dist/tree/Element";

export default class Node extends Base {
    public readonly stage: Stage;

    constructor(stage: Stage, base?: Element) {
        super(base || new Element(stage));
        this.stage = stage;
    }

    get el(): Element {
        return this.element!;
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
