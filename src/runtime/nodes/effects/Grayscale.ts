import { Container } from "../Container";
import { WebGLGrayscaleShader } from "tree2d";
import { ensureFloat } from "../Node";
import { VugelStage } from "../../../wrapper";

export class Grayscale extends Container {
    private shader = new WebGLGrayscaleShader(this.stage.context);

    constructor(stage: VugelStage) {
        super(stage);
        this.el.renderToTexture = true;
        this.el.shader = this.shader;
    }

    set amount(v: number) {
        this.shader.amount = ensureFloat(v);
    }
}
