import { Container } from "./Container";
import { Node } from "./Node";
import { Base } from "./Base";
import { Element } from "tree2d";

/**
 * Allows direct child mutations.
 * Disables vue vdom patching.
 */
export class DirectContainer extends Container {
    private childList = this.el.childList;

    _appendChild(child: Base) {
        // Ignore virtual dom operations.
    }

    _removeChild(child: Base) {
        // Ignore virtual dom operations.
    }

    _insertBefore(child: Base, anchor: Base) {
        // Ignore virtual dom operations.
    }

    add(item: Node) {
        this.childList.add(item.el);
    }

    itemInList(item: Node): boolean {
        return this.childList.itemInList(item.el);
    }

    addAt(item: Node, index: number) {
        return this.childList.addAt(item.el, index);
    }

    replace(item: Node, prevItem: Node) {
        return this.childList.replace(item.el, prevItem.el);
    }

    setAt(item: Node, index: number) {
        this.childList.setAt(item.el, index);
    }

    getAt(index: number): Node | undefined {
        const el = this.childList.getAt(index);
        return el ? el.data : undefined;
    }

    getIndex(item: Node): number {
        return this.childList.getIndex(item.el);
    }

    remove(item: Node) {
        this.childList.remove(item.el);
    }

    removeAt(index: number) {
        this.childList.removeAt(index);
    }

    getChildren(): Node[] {
        return this.childList.getItems().map((element: Element) => element.data as Node);
    }
}
