import { Container } from "../Container";
import { Stage } from "tree2d";

export class Rectangle extends Container {
    constructor(stage: Stage) {
        super(stage);
        this.el.texture = stage.rectangleTexture;
    }
}
