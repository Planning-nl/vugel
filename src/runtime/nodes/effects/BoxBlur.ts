import { Container } from "../Container";
import { Stage, BoxBlurShader } from "tree2d";

export class BoxBlur extends Container {
    private shader = new BoxBlurShader(this.stage.context);

    constructor(stage: Stage) {
        super(stage);
        this.el.shader = this.shader;
        this.el.renderToTexture = true;
    }

}
