import { Node } from "../Node";
import { Texture as Tree2dTexture } from "tree2d";
import { Constructor } from "../../utils/types";

export class Texture extends Node {
    set type(v: Constructor<Tree2dTexture>) {
        this.el.texture = new v(this.stage);
    }

    set options(v: Record<string, any>) {
        const keys = Object.keys(v);
        keys.forEach((key: string) => {
            (this.el.texture as any)[key] = v[key];
        });
    }
}
