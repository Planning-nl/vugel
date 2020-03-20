import Node, { ensureFloat } from './Node';
import Stage from 'tree2d/dist/tree/Stage';
import TextTexture from 'tree2d/dist/textures/text/TextTexture';

export default class Text extends Node {
    private tex: TextTexture;

    constructor(stage: Stage) {
        super(stage);
        this.tex = new TextTexture(stage);
        this.el.texture = this.tex;
    }

    set text(value: string) {
        this.tex.text = value;
    }

    set fontSize(value: number) {
        this.tex.fontSize = ensureFloat(value);
    }
}
