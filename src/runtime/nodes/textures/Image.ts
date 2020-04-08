import { Container } from "../Container";
import { Stage } from "tree2d";
import { ImageTexture } from "tree2d";
import { ensureFloat } from "../Node";

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

    set pixelRatio(v: number) {
        this.el.texture!.pixelRatio = ensureFloat(v);
    }
}
