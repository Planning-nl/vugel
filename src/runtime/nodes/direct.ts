import {Node} from "./Node";
import {Base} from "./Base";
import {Element} from "tree2d";
import {Constructor} from "../utils/TypeUtils";
import {mixin} from "../utils/mixin";
import {DirectContainer} from "./DirectContainer";
import {Rectangle, TextTexture} from "./textures";
import {Container} from "./Container";
import { Paragraph } from "./Paragraph";

export class DirectContainerMixin extends Container {
    _appendChild(child: Base) {
        // Ignore virtual dom operations.
    }

    _removeChild(child: Base) {
        // Ignore virtual dom operations.
    }

    _insertBefore(child: Base, anchor: Base) {
        // Ignore virtual dom operations.
    }

    add(item: DirectNode) {
        item.parent = this;
        this.containerElement.childList.add(item.el);
    }

    itemInList(item: DirectNode): boolean {
        return this.containerElement.childList.itemInList(item.el);
    }

    addAt(item: DirectNode, index: number) {
        item.parent = this;
        return this.containerElement.childList.addAt(item.el, index);
    }

    replace(item: DirectNode, prevItem: DirectNode) {
        return this.containerElement.childList.replace(item.el, prevItem.el);
    }

    setAt(item: DirectNode, index: number) {
        item.parent = this;
        this.containerElement.childList.setAt(item.el, index);
    }

    getAt(index: number): DirectNode | undefined {
        const el = this.containerElement.childList.getAt(index);
        return el ? el.data : undefined;
    }

    getIndex(item: DirectNode): number {
        return this.containerElement.childList.getIndex(item.el);
    }

    remove(item: DirectNode) {
        item.parent = undefined;
        this.containerElement.childList.remove(item.el);
    }

    removeAt(index: number) {
        const item = this.containerElement.childList.removeAt(index);
        item.data.parent = undefined;
    }

    getChildren(): Node[] {
        return this.containerElement.childList.getItems().map((element: Element) => element.data as DirectNode);
    }

    setItems(items: DirectNode[]) {
        this.containerElement.childList.setItems(items.map((item) => item.el));
        items.forEach((item) => (item.parent = this));
    }
    
}

export type Direct<T extends Node> = T & DirectContainer;

export type DirectNode = Direct<Container> | TextTexture | Paragraph;

export function getDirectType<T extends Node>(nodeType: Constructor<T>): Constructor<ConvertedDirectNode<T>> {
    if (nodeType.prototype instanceof Container) {
        if (!(nodeType as any).__direct) {
            // Create subclass.
            const directType = (class extends (nodeType as any) {}) as Constructor<T>;
            mixin(directType, DirectContainer);
            (nodeType as any).__direct = directType;
        }
        return (nodeType as any).__direct;
    } else if ((nodeType as any) === Container) {
        return DirectContainer as any;
    } else {
        return nodeType as any;
    }
}

export type ConvertedDirectNode<T extends Node> = T extends Container ? Direct<T> : T;
