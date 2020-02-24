import Node from "./Node";

export default class Image extends Node {
    constructor(stage: typeof lng.Stage) {
        super(stage);
        this.element.texture = new lng.textures.ImageTexture(stage);
    }

    set src(value: string) {
        this.element.texture.src = value;
    }
}
