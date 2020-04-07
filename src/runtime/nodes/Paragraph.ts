import { Node, ensureFloat, ensureInt } from "./Node";
import { Stage, Element, TextTexture } from "tree2d/lib";
import { TextTextureSettings } from "./TextTextureSettings";
import Delegator from "../utils/Delegator";

class Paragraph extends Node {
    private settings = new TextTextureSettings(() => this.update());

    private text: string = "";
    private _lineHeight: number = 0;
    private _fontColor: number = 0xff000000;

    set lineHeight(v: number) {
        this._lineHeight = ensureFloat(v);
        this.update();
    }

    set fontColor(v: number) {
        this._fontColor = ensureInt(v);
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
        const s = this.settings.textSettings;
        const fontSize = s.fontSize || 24;
        const lineHeight = Math.round(this._lineHeight || fontSize * 1.3);
        const letterSpacing = Math.round(fontSize * 0.2);
        const margin = Math.round(lineHeight - fontSize);
        const fontColor = this._fontColor || 0xffffffff;

        const words = this.text.split(/\s+/);
        if (words.length > 1 || words[0] != "") {
            const els = words.map((word: string) => {
                const el = new Element(this.stage);
                const texture = new TextTexture(this.stage);
                texture.text = word;
                texture.setSettings(s);
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

Delegator.delegate(Paragraph, TextTextureSettings, "settings");
interface Paragraph extends TextTextureSettings {}

export { Paragraph };
