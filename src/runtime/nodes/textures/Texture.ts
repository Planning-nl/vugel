import { Node } from "../Node";
import { Texture as Tree2dTexture } from "tree2d";

export class Texture extends Node {
    set texture(v: Tree2dTexture) {
        this.el.texture = v;
    }
}
