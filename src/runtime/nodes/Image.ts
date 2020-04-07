import { Container } from "./Container";
import { Stage } from "tree2d/lib";
import { ImageTexture } from "tree2d/lib";

export class Image extends Container {
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
