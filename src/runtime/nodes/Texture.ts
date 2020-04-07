import { Node } from "./Node";
import { Texture as Tree2dTexture, Patcher } from "tree2d/lib";
import { Constructor } from "tree2d/lib/util/types";

export class Texture extends Node {
    set type(v: Constructor<Tree2dTexture>) {
        this.el.texture = new v(this.stage);
    }

    set options(v: object) {
        Patcher.patchObject(this.el.texture, v);
    }
}
