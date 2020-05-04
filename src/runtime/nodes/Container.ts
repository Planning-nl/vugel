import { Node } from "./Node";
import { ensureBoolean, ensureFloat } from "../utils/TypeUtils";
import { Element } from "tree2d";

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

    get clipping() {
        return this.el.clipping;
    }

    set clipping(v: boolean) {
        this.el.clipping = ensureBoolean(v);
    }

    get clipbox() {
        return this.el.clipbox;
    }

    set clipbox(v: boolean) {
        this.el.clipbox = ensureBoolean(v);
    }

    get "render-to-texture"() {
        return this.el.renderToTexture;
    }

    set "render-to-texture"(v: boolean) {
        this.el.renderToTexture = ensureBoolean(v);
    }

    get "render-to-texture-lazy"() {
        return this.el.renderToTextureLazy;
    }

    set "render-to-texture-lazy"(v: boolean) {
        this.el.renderToTextureLazy = ensureBoolean(v);
    }

    get "render-to-texture-offscreen"() {
        return this.el.renderToTextureOffscreen;
    }

    set "render-to-texture-offscreen"(v: boolean) {
        this.el.renderToTextureOffscreen = ensureBoolean(v);
    }

    get "render-to-texture-colorize"() {
        return this.el.renderToTextureColorize;
    }

    set "render-to-texture-colorize"(v: boolean) {
        this.el.renderToTextureColorize = ensureBoolean(v);
    }

    get flex() {
        return this.el.flex;
    }

    set flex(v: boolean) {
        this.el.flex = ensureBoolean(v);
    }

    get "flex-direction"() {
        return this.el.flexDirection;
    }

    set "flex-direction"(v: "row" | "row-reverse" | "column" | "column-reverse") {
        this.el.flexDirection = v;
    }

    get "flex-wrap"() {
        return this.el.flexWrap;
    }

    set "flex-wrap"(v: boolean) {
        this.el.flexWrap = ensureBoolean(v);
    }

    get "flex-align-items"() {
        return this.el.flexAlignItems;
    }

    set "flex-align-items"(v: "flex-start" | "flex-end" | "center" | "stretch") {
        this.el.flexAlignItems = v;
    }

    get "flex-justify-content"() {
        return this.el.flexJustifyContent;
    }

    set "flex-justify-content"(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly",
    ) {
        this.el.flexJustifyContent = v;
    }

    get "flex-align-content"() {
        return this.el.flexAlignContent;
    }

    set "flex-align-content"(
        v: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly" | "stretch",
    ) {
        this.el.flexAlignContent = v;
    }

    get padding() {
        return this.el.padding;
    }

    set padding(v: number) {
        this.el.padding = ensureFloat(v);
    }

    get "padding-left"() {
        return this.el.paddingLeft;
    }

    set "padding-left"(v: number) {
        this.el.paddingLeft = ensureFloat(v);
    }

    get "padding-right"() {
        return this.el.paddingRight;
    }

    set "padding-right"(v: number) {
        this.el.paddingRight = ensureFloat(v);
    }

    get "padding-top"() {
        return this.el.paddingTop;
    }

    set "padding-top"(v: number) {
        this.el.paddingTop = ensureFloat(v);
    }

    get "padding-bottom"() {
        return this.el.paddingBottom;
    }

    set "padding-bottom"(v: number) {
        this.el.paddingBottom = ensureFloat(v);
    }
}
