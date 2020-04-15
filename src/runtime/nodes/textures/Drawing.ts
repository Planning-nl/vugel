import { Node } from "../Node";
import { Element, Texture } from "tree2d/lib";
import DrawingTexture, { DrawingFunction } from "tree2d/lib/textures/DrawingTexture";
import { VugelStage } from "../../../wrapper";

export { DrawingFunction };

export class Drawing extends Node {
    private subject = new Element(this.stage);
    private drawingTexture = new DrawingTexture(this.stage);

    constructor(stage: VugelStage) {
        super(stage);

        this.el.childList.add(this.subject);

        this.subject.texture = this.drawingTexture;

        this.el.onResize = ({ element, w, h }) => this.handleResize(element, w, h);
        this.subject.onTextureLoaded = ({ element, texture }) => this.handleTextureLoaded(element, texture);
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
