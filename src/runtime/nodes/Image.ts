import Node from './Node';
import Stage from 'tree2d/dist/tree/Stage';
import ImageTexture from 'tree2d/dist/textures/ImageTexture';

export default class Image extends Node {
    private tex: ImageTexture;

    constructor(stage: Stage) {
        super(stage);
        this.tex = new ImageTexture(stage);
        this.el.texture = this.tex;
    }

    set src(value: string) {
        this.tex.src = value;
    }
}
