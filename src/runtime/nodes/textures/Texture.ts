import { Node } from "../Node";
import { VugelStage } from "../../../wrapper";
import { Texture as Tree2dTexture } from "tree2d";

export type TextureFactory = (stage: VugelStage) => { texture: Tree2dTexture; reusable: boolean };

const factories = new Map<TextureFactory, Tree2dTexture>();

export class Texture extends Node {
    set texture(v: Tree2dTexture) {
        this.el.texture = v;
    }

    set ["texture-factory"](v: TextureFactory) {
        let texture = factories.get(v);
        if (!texture) {
            const info = v(this.stage);
            texture = info.texture;
            if (info.reusable) {
                factories.set(v, texture);
            }
        }
        this.texture = texture;
    }
}
