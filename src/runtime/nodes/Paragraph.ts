import Node, { ensureFloat, ensureInt } from "./Node";
import { Stage, Element, TextTexture } from "tree2d/lib";

type TextSettings = {
    fontStyle: string;
    lineHeight: number;
    fontSize: number;
    fontFace: string[];
    letterSpacing: number;
    fontColor: number;
};

export default class Paragraph extends Node {
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

    set letterSpacing(v: number) {
        this.settings.letterSpacing = ensureFloat(v);
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

    set fontColor(v: number) {
        this.settings.fontColor = ensureInt(v);
        this.update();
    }

    constructor(stage: Stage) {
        super(stage);
        this.el.flex = true;
        this.el.flexWrap = true;
    }

    setElementText(text: string) {
        this.text = text;
        this.update();
    }

    private update() {
        const s = this.settings;
        const fontSize = s.fontSize || 24;
        const lineHeight = Math.round(s.lineHeight || fontSize * 1.3);
        const letterSpacing = Math.round(fontSize * 0.2 + (s.letterSpacing || 0));
        const margin = Math.round(lineHeight - fontSize);
        const fontColor = s.fontColor || 0xffffffff;

        const textSettings = { fontSize: fontSize, fontFace: s.fontFace, fontStyle: s.fontStyle };

        const words = this.text.split(/\s+/);
        if (words.length > 1 || words[0] != "") {
            const els = words.map((word: string) => {
                const el = new Element(this.stage);
                const texture = new TextTexture(this.stage);
                texture.text = word;
                texture.setSettings(textSettings);
                el.texture = texture;
                el.marginRight = letterSpacing;
                el.marginTop = Math.round(margin * 0.8);
                el.marginBottom = Math.round(margin * 0.2);
                el.color = fontColor;
                return el;
            });

            this.el.childList.setItems(els);
        }
    }
}
