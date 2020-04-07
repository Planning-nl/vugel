import { Node } from "./Node";
import { Stage } from "tree2d/lib";

export class Rect extends Node {
    constructor(stage: Stage) {
        super(stage);
        this.el.texture = stage.rectangleTexture;
    }
}
