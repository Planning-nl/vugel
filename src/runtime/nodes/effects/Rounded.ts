import { Container } from "../Container";
import { Stage, RoundedRectangleShader } from "tree2d";
import { ensureFloat } from "../Node";

export class Rounded extends Container {
    private shader = new RoundedRectangleShader(this.stage.context);

    constructor(stage: Stage) {
        super(stage);
        this.el.shader = this.shader;
        this.el.renderToTexture = true;
    }

    set radius(v: number) {
        this.shader.radius = ensureFloat(v);
    }
}
