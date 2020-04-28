import { Node } from "./Node";
import { ensureBoolean, ensureFloat } from "../utils/TypeUtils";
import { Element } from "tree2d";
import { Base } from "./Base";

export class Container extends Node {
    public containerElement: Element = this.el;

    getChildren(): Node[] {
        let c = this.firstChild;
        const items: Node[] = [];
        while (c) {
            if (c.element) {
                items.push(c as Node);
            }
            c = c.nextSibling;
        }
        return items;
    }

    syncWithTree2d() {
        super.syncWithTree2d();
        const items: Element[] = [];
        let c = this.firstChild;
        while (c) {
            if (c.element) {
                items.push(c.element);
            }
            c = c.nextSibling;
        }
        this.containerElement.childList.setItems(items);
    }

    set "force-z-index-context"(v: boolean) {
        this.el.forceZIndexContext = ensureBoolean(v);
    }

    set clipping(v: boolean) {
        this.el.clipping = ensureBoolean(v);
    }

    set clipbox(v: boolean) {
        this.el.clipbox = ensureBoolean(v);
    }

    set "render-to-texture"(v: boolean) {
        this.el.renderToTexture = ensureBoolean(v);
    }

    set "render-to-texture-lazy"(v: boolean) {
        this.el.renderToTextureLazy = ensureBoolean(v);
    }

    set "render-to-texture-offscreen"(v: boolean) {
        this.el.renderToTextureOffscreen = ensureBoolean(v);
    }

    set "render-to-texture-colorize"(v: boolean) {
        this.el.renderToTextureColorize = ensureBoolean(v);
    }

    set flex(v: boolean) {
        this.el.flex = ensureBoolean(v);
    }

    set "flex-direction"(v: "row" | "row-reverse" | "column" | "column-reverse") {
        this.el.flexDirection = v;
    }

    set "flex-wrap"(v: boolean) {
        this.el.flexWrap = ensureBoolean(v);
    }

    set "flex-align-items"(v: "flex-start" | "flex-end" | "center" | "stretch") {
        this.el.flexAlignItems = v;
    }

    set "flex-justify-content"(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly",
    ) {
        this.el.flexJustifyContent = v;
    }

    set "flex-align-content"(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "stretch",
    ) {
        this.el.flexAlignContent = v;
    }

    set padding(v: number) {
        this.el.padding = ensureFloat(v);
    }

    set "padding-left"(v: number) {
        this.el.paddingLeft = ensureFloat(v);
    }

    set "padding-right"(v: number) {
        this.el.paddingRight = ensureFloat(v);
    }

    set "padding-top"(v: number) {
        this.el.paddingTop = ensureFloat(v);
    }

    set "padding-bottom"(v: number) {
        this.el.paddingBottom = ensureFloat(v);
    }
}
