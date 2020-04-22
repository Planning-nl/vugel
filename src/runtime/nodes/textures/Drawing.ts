import { Element } from "tree2d";
import { DrawingFunction, DrawingTexture } from "tree2d";
import { DynamicSizeTexture } from "./DynamicSizeTexture";
import { VugelStage } from "../../../wrapper";

export { DrawingFunction };

export class Drawing extends DynamicSizeTexture {
    private drawingTexture = new DrawingTexture(this.stage);

    constructor(stage: VugelStage) {
        super(stage);
        this.textureElement.texture = this.drawingTexture;
    }

    set onDraw(f: DrawingFunction) {
        this.drawingTexture.drawingFunction = f;
    }

    protected handleResize(element: Element, w: number, h: number) {
        this.drawingTexture.canvasWidth = w;
        this.drawingTexture.canvasHeight = h;
    }

    update() {
        this.drawingTexture._changed();
    }
}
