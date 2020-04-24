import { Element, Texture } from "tree2d";
import { VugelStage } from "../../../wrapper";
import { Container } from "../Container";

export abstract class DynamicSizeTexture extends Container {
    private wrapper = new Element(this.stage);
    private background = new Element(this.stage);

    constructor(stage: VugelStage) {
        super(stage);

        this.el.childList.add(this.background);
        this.el.childList.add(this.wrapper);

        // Make sure we don't take up space if the el is flex.
        this.background.skipInLayout = true;

        this.wrapper.skipInLayout = true;
        this.wrapper.funcW = (w: number) => w;
        this.wrapper.funcH = (w: number, h: number) => h;
        this.containerElement = this.wrapper;

        this.wrapper.onResize = ({ element, w, h }) => this.handleResize(element, w, h);
        this.background.onTextureLoaded = ({ element, texture }) => this.handleTextureLoaded(element, texture);
        this.background.ref = "background";
    }

    get textureElement(): Element {
        return this.background;
    }

    protected abstract handleResize(element: Element, w: number, h: number): void;

    private handleTextureLoaded(element: Element, texture: Texture) {
        const renderInfo = texture.getSource()?.getRenderInfo();
        this.background.x = -(renderInfo?.offsetX || 0);
        this.background.y = -(renderInfo?.offsetY || 0);
    }
}
