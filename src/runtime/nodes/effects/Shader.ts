import { Container } from "../Container";
import { Shader as Tree2dShader } from "tree2d";
import { CoreContext } from "tree2d";

export type ShaderFactory = (context: CoreContext) => { shader: Tree2dShader; reusable: boolean; }

const factories = new Map<ShaderFactory, Tree2dShader>();

export class Shader extends Container {
    set shader(v: Tree2dShader) {
        this.el.shader = v;
    }

    set ["shader-factory"](v: ShaderFactory) {
        let shader = factories.get(v);
        if (!shader) {
            const info = v(this.stage.context);
            shader = info.shader;
            if (info.reusable) {
                factories.set(v, shader);
            }
        }
        this.shader = shader;
    }
}
