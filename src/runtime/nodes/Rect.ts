import Node from './Node';
import Stage from 'tree2d/dist/tree/Stage';
import RectangleTexture from 'tree2d/dist/textures/RectangleTexture';

export default class Rect extends Node {
    constructor(stage: Stage) {
        super(stage);
        this.el.texture = stage.rectangleTexture;
    }
}
