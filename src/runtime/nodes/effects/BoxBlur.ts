import { Container } from "../Container";
import { BoxBlurShader } from "tree2d/lib";
import { VugelStage } from "../../../wrapper";

export class BoxBlur extends Container {
    private shader = new BoxBlurShader(this.stage.context);

    constructor(stage: VugelStage) {
        super(stage);
        this.el.shader = this.shader;
        this.el.renderToTexture = true;
    }
}
