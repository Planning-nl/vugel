import { ensureFloat, Node } from "./Node";
import { Stage, Element, Texture } from "tree2d/lib";
import SvgTexture, { SvgOptions } from "tree2d/lib/textures/SvgTexture";
import { ElementResizeEventCallback } from "tree2d/lib/tree/ElementListeners";

export class Svg extends Node {
    private options: SvgOptions = { w: 0, h: 0, src: "" };

    private svgTexture = new SvgTexture(this.stage);

    constructor(stage: Stage) {
        super(stage);

        this.el.texture = this.svgTexture;

        this.el.onResize = (element: Element, w: number, h: number) => this.handleResize(element, w, h);
    }

    set src(v: string) {
        this.options.src = v;
        this.updateTextureOptions();
    }

    set pixelRatio(v: number) {
        this.el.texture!.pixelRatio = ensureFloat(v);
    }

    private updateDimensions(w: number, h: number) {
        this.options.w = w;
        this.options.h = h;
        this.updateTextureOptions();
    }

    private updateTextureOptions() {
        this.svgTexture.options = this.options;
    }

    set onResize(v: ElementResizeEventCallback | undefined) {
        console.warn("You can't set onResize on a <svg>");
    }

    private handleResize(element: Element, w: number, h: number) {
        if (this.options) {
            this.updateDimensions(w, h);
        }
    }
}
