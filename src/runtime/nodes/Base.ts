import { Element } from "tree2d";

export class Base {
    public element?: Element = undefined;

    protected children = new Set<Base>();

    public parent?: Base = undefined;

    public prevSibling: Base | null = null;
    public nextSibling: Base | null = null;

    constructor(element: Element | undefined) {
        this.element = element;
    }

    appendChild(child: Base) {
        child.parent = this;
        this.children.add(child);
        child.nextSibling = null;
    }

    removeChild(child: Base) {
        child.parent = undefined;

        if (child.prevSibling) {
            child.prevSibling.nextSibling = child.nextSibling;
        }

        if (child.nextSibling) {
            child.nextSibling.prevSibling = child.prevSibling;
        }

        this.children.delete(child);
        child.nextSibling = null;
    }

    insertBefore(child: Base, anchor: Base) {
        child.parent = this;

        if (anchor.prevSibling) {
            anchor.prevSibling.nextSibling = child;
        }

        anchor.prevSibling = child;

        this.children.add(child);
        child.nextSibling = anchor;
    }

    clearChildren() {
        this.children.forEach((child) => {
            child.parent = undefined;
            child.nextSibling = null;
        });
        this.children = new Set<Base>();
    }

    setElementText(text: string) {
        // Default: ignore text.
    }
}
