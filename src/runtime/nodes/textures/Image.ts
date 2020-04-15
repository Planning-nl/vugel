import { Container } from "../Container";
import { ImageTexture } from "tree2d/lib";
import { ensureFloat } from "../Node";
import { VugelStage } from "../../../wrapper";

export class Image extends Container {
    private tex: ImageTexture;

    constructor(stage: VugelStage) {
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
