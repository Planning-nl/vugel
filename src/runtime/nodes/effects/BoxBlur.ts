import { Container } from "../Container";
import { WebGLBoxBlurShader } from "tree2d";
import { VugelStage } from "../../../wrapper";

export class BoxBlur extends Container {
    private shader = new WebGLBoxBlurShader(this.stage.context);

    constructor(stage: VugelStage) {
        super(stage);
        this.el.shader = this.shader;
        this.el.renderToTexture = true;
    }
}
