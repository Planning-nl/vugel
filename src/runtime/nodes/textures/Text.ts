import { Node } from "../Node";
import { TextTexture } from "tree2d";
import { TextTextureSettings } from "./TextTextureSettings";
import Delegator from "../../utils/Delegator";
import { VugelStage } from "../../../wrapper";

class Text extends Node {
    private texture = new TextTexture(this.stage);

    private settings = new TextTextureSettings(() => this.update());

    constructor(stage: VugelStage) {
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
