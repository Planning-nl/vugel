import { Container } from "../Container";
import { Stage, GrayscaleShader } from "tree2d";
import { ensureFloat } from "../Node";

export class Grayscale extends Container {
    private shader = new GrayscaleShader(this.stage.context);

    constructor(stage: Stage) {
        super(stage);
        this.el.shader = this.shader;
    }

    set amount(v: number) {
        this.shader.amount = ensureFloat(v);
    }
}
