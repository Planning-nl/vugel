import { Node } from "../Node";
import { VugelStage } from "../../../wrapper";
import { Texture as Tree2dTexture } from "tree2d";

export type TextureFactory = (stage: VugelStage) => Tree2dTexture;

const factories = new Map<TextureFactory, Tree2dTexture>();

export class Texture extends Node {
    set texture(v: Tree2dTexture) {
        this.el.texture = v;
    }

    set ["texture-factory"](v: TextureFactory) {
        let texture = factories.get(v);
        if (!texture) {
            texture = v(this.stage);
            factories.set(v, texture);
        }
        this.texture = texture;
    }
}
