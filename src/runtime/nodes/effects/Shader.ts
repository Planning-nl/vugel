import { Container } from "../Container";
import { Shader as Tree2dShader } from "tree2d";
import { CoreContext } from "tree2d";

export type ShaderFactory = (context: CoreContext) => Tree2dShader;

const factories = new Map<ShaderFactory, Tree2dShader>();

export class Shader extends Container {
    set shader(v: Tree2dShader) {
        this.el.shader = v;
    }

    set ["shader-factory"](v: ShaderFactory) {
        let shader = factories.get(v);
        if (!shader) {
            shader = v(this.stage.context);
            factories.set(v, shader);
        }
        this.shader = shader;
    }
}
