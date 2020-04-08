import { Node } from "../Node";
import { Stage, TextTexture } from "tree2d";
import { TextTextureSettings } from "./TextTextureSettings";
import Delegator from "../../utils/Delegator";

class Text extends Node {
    private texture = new TextTexture(this.stage);

    private settings = new TextTextureSettings(() => this.update());

    constructor(stage: Stage) {
        super(stage);
        this.el.texture = this.texture;
    }

    setElementText(text: string) {
        this.texture.text = text;
    }

    private update() {
        this.texture.setSettings(this.settings.textSettings);
    }
}

Delegator.delegate(Text, TextTextureSettings, "settings");
interface Text extends TextTextureSettings {}

export { Text };
