import Node, { ensureFloat, ensureInt } from "./Node";
import { Stage, Element, TextTexture } from "tree2d/lib";

export type TextSettings = {
    fontStyle: string;
    lineHeight: number;
    fontSize: number;
    fontFace: string[];
};

export default class Text extends Node {
    private settings: Partial<TextSettings> = {};

    private text: string = "";

    set fontSize(v: number) {
        this.settings.fontSize = ensureFloat(v);
        this.update();
    }

    set lineHeight(v: number) {
        this.settings.lineHeight = ensureFloat(v);
        this.update();
    }

    set fontStyle(v: string) {
        this.settings.fontStyle = v;
        this.update();
    }

    set fontFace(v: string | string[]) {
        if (!Array.isArray(v)) {
            v = [v];
        }
        this.settings.fontFace = v;
        this.update();
    }

    constructor(stage: Stage) {
        super(stage);
        this.el.texture = new TextTexture(this.stage);
    }

    setElementText(text: string) {
        this.text = text;
        this.update();
    }

    private update() {
        const s = this.settings;
        const fontSize = s.fontSize || 24;

        const textSettings = { fontSize: fontSize, fontFace: s.fontFace, fontStyle: s.fontStyle };

        const texture = new TextTexture(this.stage);
        texture.text = this.text;
        texture.setSettings(textSettings);
        this.el.texture = texture;
    }
}
