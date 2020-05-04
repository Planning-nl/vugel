import { Container } from "../Container";
import { ImageTexture } from "tree2d";
import { VugelStage } from "../../../wrapper";

export class Picture extends Container {
    private tex: ImageTexture;

    constructor(stage: VugelStage) {
        super(stage);
        this.tex = new ImageTexture(stage);
        this.el.texture = this.tex;
    }

    get src() {
        return this.tex.src;
    }

    set src(value: string | undefined) {
        this.tex.src = value;
    }
}
