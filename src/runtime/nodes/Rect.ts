import Node from "./Node";
import { Stage } from "tree2d/lib";

export default class Rect extends Node {
    constructor(stage: Stage) {
        super(stage);
        this.el.texture = stage.rectangleTexture;
    }
}
