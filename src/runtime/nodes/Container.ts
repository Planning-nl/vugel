import { Node } from "./Node";
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
        this.children.forEach((child) => (child.parentNode = undefined));
        this.children = [];
        this.containerElement.childList.clear();
    }
}
