import { Container } from "../Container";
import { VugelStage } from "../../../wrapper";

export class Rectangle extends Container {
    constructor(stage: VugelStage) {
        super(stage);
        this.el.texture = stage.rectangleTexture;
    }
}
