import { Element } from "tree2d/lib";
import SvgTexture, { SvgOptions } from "tree2d/lib/textures/SvgTexture";
import { VugelStage } from "../../../wrapper";
import { DynamicSizeTexture } from "./DynamicSizeTexture";

export class Svg extends DynamicSizeTexture {
    private options: SvgOptions = { w: 0, h: 0, src: "" };

    private svgTexture = new SvgTexture(this.stage);

    constructor(stage: VugelStage) {
        super(stage);
        this.textureElement.texture = this.svgTexture;
    }

    set src(v: string) {
        this.options.src = v;
        this.updateTextureOptions();
    }

    private updateDimensions(w: number, h: number) {
        this.options.w = w;
        this.options.h = h;
        this.updateTextureOptions();
    }

    private updateTextureOptions() {
        this.svgTexture.options = this.options;
    }

    protected handleResize(element: Element, w: number, h: number) {
        if (this.options) {
            this.updateDimensions(w, h);
        }
    }
}
