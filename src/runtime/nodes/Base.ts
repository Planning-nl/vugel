import { Element } from "tree2d/lib";

export default class Base {
    public element?: Element;

    protected children: Base[] = [];

    public parentNode?: Base = undefined;

    public nextSibling: Base | null = null;

    constructor(element: Element | undefined) {
        this.element = element;
    }

    appendChild(child: Base) {
        child.parentNode = this;
        this.children.push(child);
        child.nextSibling = null;
    }

    removeChild(child: Base) {
        child.parentNode = undefined;
        const index = this.children.indexOf(child);
        if (index > 0) {
            this.children[index - 1].nextSibling = child.nextSibling;
        }
        this.children.splice(index, 1);
        child.nextSibling = null;
    }

    insertBefore(child: Base, anchor: Base) {
        child.parentNode = this;
        const index = this.children.lastIndexOf(anchor);
        if (index > 0) {
            this.children[index - 1].nextSibling = child;
        }
        this.children.splice(index, 0, child);
        child.nextSibling = anchor;
    }

    clearChildren() {
        this.children.forEach((child) => {
            child.parentNode = undefined;
            child.nextSibling = null;
        });
        this.children = [];
    }

    setElementText(text: string) {
        // Default: ignore text.
    }
}
