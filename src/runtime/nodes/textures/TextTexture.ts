import { Node } from "../Node";
import { TextTexture as Tree2dTextTexture } from "tree2d";
import { TextTextureSettings } from "./TextTextureSettings";
import { Delegator } from "../../utils/Delegator";
import { VugelStage } from "../../../wrapper";

class TextTexture extends Node {
    private texture = new Tree2dTextTexture(this.stage);

    private settings = new TextTextureSettings(() => this.update());

    constructor(stage: VugelStage) {
        super(stage);
        this.el.texture = this.texture;
    }

    get text() {
        return this.texture.text;
    }

    set text(text: string) {
        this.texture.text = text;
        this.update();
    }

    setElementText(text: string) {
        this.texture.text = text.trim();
    }

    private update() {
        this.texture.setSettings(this.settings.textSettings);
    }
}

Delegator.delegate(TextTexture, TextTextureSettings, "settings");
interface Text extends TextTextureSettings {}

export { TextTexture };
