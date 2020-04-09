import { ensureBoolean, ensureFloat, Node } from "./Node";
import { Element } from "tree2d/lib";
import { Base } from "./Base";

export class Container extends Node {
    public readonly containerElement: Element = this.el;

    appendChild(child: Base) {
        super.appendChild(child);
        if (child.element) {
            this.containerElement.childList.add(child.element);
        }
    }

    removeChild(child: Base) {
        super.removeChild(child);
        if (child.element) {
            this.containerElement.childList.remove(child.element);
        }
    }

    insertBefore(child: Base, anchor: Base) {
        super.insertBefore(child, anchor);
        const item = child.element;
        if (item) {
            const baseAnchor = this.getBaseAnchor(anchor);
            if (baseAnchor) {
                const insertBefore = baseAnchor.element!;
                const index = this.containerElement.childList.getIndex(insertBefore);
                if (index > 0) {
                    this.containerElement.childList.addAt(item, index);
                } else {
                    throw new Error("Can't find anchor in tree2d child list: " + insertBefore.getLocationString());
                }
            } else {
                this.containerElement.childList.add(item);
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
        this.children.forEach((child) => (child.parent = undefined));
        this.children = [];
        this.containerElement.childList.clear();
    }

    set forceZIndexContext(v: boolean) {
        this.el.forceZIndexContext = ensureBoolean(v);
    }

    set clipping(v: boolean) {
        this.el.clipping = ensureBoolean(v);
    }

    set clipbox(v: boolean) {
        this.el.clipbox = ensureBoolean(v);
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
}
