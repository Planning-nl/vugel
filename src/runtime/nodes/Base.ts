import { Element } from "tree2d";
import { nextTick } from "../..";

export class Base {
    public element?: Element = undefined;

    protected children = new Set<Base>();

    public parent?: Base = undefined;

    public firstChild: Base | null = null;
    public lastChild: Base | null = null;
    public prevSibling: Base | null = null;
    public nextSibling: Base | null = null;

    private mustSync = false;

    constructor(element: Element | undefined) {
        this.element = element;
    }

    appendChild(child: Base) {
        child.unlinkSiblings();

        child.parent = this;
        this.children.add(child);

        if (!this.firstChild) {
            this.firstChild = child;
        }
        child.prevSibling = this.lastChild;
        child.nextSibling = null;
        if (this.lastChild) {
            this.lastChild.nextSibling = child;
        }
        this.lastChild = child;

        this.registerSync();
    }

    private unlinkSiblings() {
        if (this.parent?.firstChild === this) {
            this.parent!.firstChild = this.nextSibling;
        }

        if (this.parent?.lastChild === this) {
            this.parent!.lastChild = this.prevSibling;
        }

        if (this.prevSibling) {
            this.prevSibling.nextSibling = this.nextSibling;
        }

        if (this.nextSibling) {
            this.nextSibling.prevSibling = this.prevSibling;
        }

        this.prevSibling = null;
        this.nextSibling = null;
    }

    removeChild(child: Base) {
        child.unlinkSiblings();

        child.parent = undefined;

        this.children.delete(child);

        this.registerSync();
    }

    insertBefore(child: Base, anchor: Base) {
        child.unlinkSiblings();

        child.parent = this;

        if (anchor.prevSibling) {
            child.prevSibling = anchor.prevSibling;
            anchor.prevSibling.nextSibling = child;
        }

        anchor.prevSibling = child;
        child.nextSibling = anchor;

        if (this.firstChild === anchor) {
            this.firstChild = child;
        }

        this.children.add(child);

        this.registerSync();
    }

    clearChildren() {
        this.children.forEach((child) => {
            child.parent = undefined;
            child.prevSibling = null;
            child.nextSibling = null;
        });
        this.children = new Set<Base>();
        this.firstChild = null;
        this.lastChild = null;

        this.registerSync();
    }

    private registerSync() {
        if (!this.mustSync) {
            this.mustSync = true;
            registerUpdatedBase(this);
        }
    }

    syncWithTree2d() {
        // Ignore.
        this.mustSync = false;
    }

    setElementText(text: string) {
        // Default: ignore text.
    }
}

let pendingSyncBase: Base | undefined = undefined;

const registerUpdatedBase = (base: Base) => {
    if (pendingSyncBase && pendingSyncBase !== base) {
        pendingSyncBase.syncWithTree2d();
    }

    if (!pendingSyncBase) {
        nextTick().then(() => {
            flushChanges();
        });
    }

    pendingSyncBase = base;
};

const flushChanges = () => {
    if (pendingSyncBase) {
        pendingSyncBase.syncWithTree2d();
    }
    pendingSyncBase = undefined;
};
