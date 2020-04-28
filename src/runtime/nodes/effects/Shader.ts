import { Container } from "../Container";
import { Shader as Tree2dShader } from "tree2d";

export class Shader extends Container {
    set shader(v: Tree2dShader) {
        this.el.shader = v;
    }
}
