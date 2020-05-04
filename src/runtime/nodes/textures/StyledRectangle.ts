import { ensureBoolean, ensureColor, ensureFloat, ensureInt } from "../../utils/TypeUtils";
import { Element } from "tree2d";
import { RoundRectTexture, RoundRectOptions } from "tree2d";
import { DynamicSizeTexture } from "./DynamicSizeTexture";
import { VugelStage } from "../../../wrapper";

export class StyledRectangle extends DynamicSizeTexture {
    private options: Partial<RoundRectOptions> = {};

    private roundRectTexture: RoundRectTexture = new RoundRectTexture(this.stage);

    constructor(stage: VugelStage) {
        super(stage);
        this.textureElement.texture = this.roundRectTexture;
    }

    get radius() {
        return this.options["radius"] ? this.options["radius"][0] : 0;
    }

    set radius(radius: number) {
        const r = ensureFloat(radius);
        this.setOption("radius", [r, r, r, r]);
    }

    get "stroke-width"() {
        return this.options["strokeWidth"] ? this.options["strokeWidth"] : 0;
    }

    set "stroke-width"(v: number) {
        this.setOption("strokeWidth", ensureInt(v));
    }

    get "stroke-color"() {
        return this.options["strokeColor"] ? this.options["strokeColor"] : 0xffffffff;
    }

    set "stroke-color"(v: number | string) {
        this.setOption("strokeColor", ensureColor(v));
    }

    get fill() {
        return this.options["fill"] ? this.options["fill"] : true;
    }

    set fill(v: boolean) {
        this.setOption("fill", ensureBoolean(v));
    }

    get "fill-color"() {
        return this.options["fillColor"] ? this.options["fillColor"] : 0xffffffff;
    }

    set "fill-color"(v: number | string) {
        this.setOption("fillColor", ensureColor(v));
    }

    get "shadow-blur"() {
        return this.options["shadowBlur"] ? this.options["shadowBlur"] : 0;
    }

    set "shadow-blur"(v: number) {
        this.setOption("shadowBlur", ensureFloat(v));
    }

    get "shadow-color"() {
        return this.options["shadowColor"] ? this.options["shadowColor"] : 0xffffffff;
    }

    set "shadow-color"(v: number | string) {
        this.setOption("shadowColor", ensureColor(v));
    }

    get "shadow-offset-x"() {
        return this.options["shadowOffsetX"] ? this.options["shadowOffsetX"] : 0;
    }

    set "shadow-offset-x"(v: number) {
        this.setOption("shadowOffsetX", ensureFloat(v));
    }

    get "shadow-offset-y"() {
        return this.options["shadowOffsetY"] ? this.options["shadowOffsetY"] : 0;
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
