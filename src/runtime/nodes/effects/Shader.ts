import { Container } from "../Container";
import { Shader as Tree2dShader } from "tree2d";
import { CoreContext } from "tree2d";

export type ShaderFactory = (context: CoreContext) => Tree2dShader | undefined;

export class Shader extends Container {
    set shader(v: Tree2dShader | undefined) {
        this.el.shader = v;
    }

    set ["shader-factory"](v: ShaderFactory) {
        this.shader = v(this.stage.context);
    }
}
