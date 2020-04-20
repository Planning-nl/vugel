import { ensureBoolean, ensureColor, ensureFloat, ensureInt } from "../Node";
import { Element } from "tree2d/lib";
import RoundRectTexture, { RoundRectOptions } from "tree2d/lib/textures/RoundRectTexture";
import { DynamicSizeTexture } from "./DynamicSizeTexture";
import { VugelStage } from "../../../wrapper";

export class StyledRectangle extends DynamicSizeTexture {
    private options: Partial<RoundRectOptions> = {};

    private roundRectTexture: RoundRectTexture = new RoundRectTexture(this.stage);

    constructor(stage: VugelStage) {
        super(stage);
        this.textureElement.texture = this.roundRectTexture;
    }

    set radius(radius: number) {
        const r = ensureFloat(radius);
        this.setOption("radius", [r, r, r, r]);
    }

    set "stroke-width"(v: number) {
        this.setOption("strokeWidth", ensureInt(v));
    }

    set "stroke-color"(v: number) {
        this.setOption("strokeColor", ensureColor(v));
    }

    set fill(v: boolean) {
        this.setOption("fill", ensureBoolean(v));
    }

    set "fill-color"(v: number) {
        this.setOption("fillColor", ensureColor(v));
    }

    set "shadow-blur"(v: number) {
        this.setOption("shadowBlur", ensureFloat(v));
    }

    set "shadow-color"(v: number) {
        this.setOption("shadowColor", ensureColor(v));
    }

    set "shadow-offset-x"(v: number) {
        this.setOption("shadowOffsetX", ensureFloat(v));
    }

    set "shadow-offset-y"(v: number) {
        this.setOption("shadowOffsetY", ensureFloat(v));
    }

    private updateDimensions(w: number, h: number) {
        this.options.w = w;
        this.options.h = h;
        this.updateRoundedRectangleTextureOptions();
    }

    private setOption<T extends keyof RoundRectOptions>(property: T, value: RoundRectOptions[T]) {
        this.options[property] = value;
        this.updateRoundedRectangleTextureOptions();
    }

    private updateRoundedRectangleTextureOptions() {
        this.roundRectTexture.options = this.options;
    }

    protected handleResize(element: Element, w: number, h: number) {
        if (this.options) {
            this.updateDimensions(w, h);
        }
    }
}
