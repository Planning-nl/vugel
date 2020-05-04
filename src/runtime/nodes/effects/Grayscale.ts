import { Container } from "../Container";
import { WebGLGrayscaleShader } from "tree2d";
import { ensureFloat } from "../../utils/TypeUtils";
import { VugelStage } from "../../../wrapper";

export class Grayscale extends Container {
    private shader = new WebGLGrayscaleShader(this.stage.context);

    constructor(stage: VugelStage) {
        super(stage);
        this.el.renderToTexture = true;
        this.el.shader = this.shader;
    }

    get amount() {
        return this.shader.amount;
    }

    set amount(v: number) {
        this.shader.amount = ensureFloat(v);
    }
}
