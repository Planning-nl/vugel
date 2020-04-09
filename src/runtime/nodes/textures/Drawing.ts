import { Node } from "../Node";
import { Stage, Element, Texture } from "tree2d";
import DrawingTexture, { DrawingFunction } from "tree2d/lib/textures/DrawingTexture";

export { DrawingFunction };

export class Drawing extends Node {
    private subject = new Element(this.stage);
    private drawingTexture = new DrawingTexture(this.stage);

    constructor(stage: Stage) {
        super(stage);

        this.el.childList.add(this.subject);

        this.subject.texture = this.drawingTexture;

        this.el.onResize = (element: Element, w: number, h: number) => this.handleResize(element, w, h);

        this.subject.onTextureLoaded = (element, texture) => this.handleTextureLoaded(element, texture);
    }

    set onDraw(f: DrawingFunction) {
        this.drawingTexture.drawingFunction = f;
    }

    private handleResize(element: Element, w: number, h: number) {
        this.drawingTexture.canvasWidth = w;
        this.drawingTexture.canvasHeight = h;
    }

    private handleTextureLoaded(element: Element, texture: Texture) {
        const renderInfo = texture.getSource()?.getRenderInfo();
        this.subject.x = -(renderInfo?.offsetX || 0);
        this.subject.y = -(renderInfo?.offsetY || 0);
    }
}
