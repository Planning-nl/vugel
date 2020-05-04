import { Node } from "../Node";
import { VugelStage } from "../../../wrapper";
import { Texture as Tree2dTexture } from "tree2d";

export type TextureFactory = (stage: VugelStage) => Tree2dTexture | undefined;

export class Texture extends Node {
    get texture() {
        return this.el.texture;
    }

    set texture(v: Tree2dTexture | undefined) {
        this.el.texture = v;
    }

    set ["texture-factory"](v: TextureFactory) {
        this.texture = v(this.stage);
    }
}
