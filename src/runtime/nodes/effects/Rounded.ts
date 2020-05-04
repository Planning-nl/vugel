import { Container } from "../Container";
import { WebGLRoundedRectangleShader } from "tree2d";
import { ensureFloat } from "../../utils/TypeUtils";
import { VugelStage } from "../../../wrapper";

export class Rounded extends Container {
    private shader = new WebGLRoundedRectangleShader(this.stage.context);

    constructor(stage: VugelStage) {
        super(stage);
        this.el.shader = this.shader;
        this.el.renderToTexture = true;
    }

    get radius() {
        return this.shader.radius;
    }

    set radius(v: number) {
        this.shader.radius = ensureFloat(v);
    }
}
