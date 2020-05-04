import { Node } from "./Node";
import { ensureColor, ensureFloat } from "../utils/TypeUtils";
import { Element, TextTexture } from "tree2d";
import { TextTextureSettings } from "./textures";
import { Delegator } from "../utils/Delegator";
import { VugelStage } from "../../wrapper";

class Paragraph extends Node {
    private settings = new TextTextureSettings(() => this.update());

    private _text: string = "";
    private _lineHeight: number = 0;
    private _fontColor: number = 0xffffffff;

    constructor(stage: VugelStage) {
        super(stage);
        this.el.flex = true;
        this.el.flexWrap = true;
    }

    get "line-height"() {
        return this._lineHeight;
    }

    set "line-height"(v: number) {
        this._lineHeight = ensureFloat(v);
        this.update();
    }

    get "font-color"() {
        return this._fontColor;
    }

    set "font-color"(v: number | string) {
        this._fontColor = ensureColor(v);
        this.update();
    }

    get text() {
        return this._text;
    }

    set text(text: string) {
        this._text = text;
        this.update();
    }

    setElementText(text: string) {
        this._text = text.trim();
        this.update();
    }

    static newlinePattern = "@+~^";

    private update() {
        const s = this.settings.textSettings;
        const fontSize = s.fontSize || 24;
        const lineHeight = Math.round(this._lineHeight || fontSize * 1.3);
        const letterSpacing = Math.round(fontSize * 0.2);
        const margin = Math.round(lineHeight - fontSize);
        const fontColor = this._fontColor || 0xffffffff;

        const text = this._text.replace(/(\r?\n)/, ` ${Paragraph.newlinePattern} `);

        const words = text.split(/\s+/);
        if (words.length > 1 || words[0] != "") {
            const els = words.map((word: string) => {
                const el = new Element(this.stage);
                if (word === Paragraph.newlinePattern) {
                    // Force line break.
                    el.funcW = (w: number) => w;
                    el.h = 0;
                } else {
                    const texture = new TextTexture(this.stage);
                    texture.text = word;
                    texture.setSettings(s);
                    el.texture = texture;
                    el.marginRight = letterSpacing;
                    el.marginTop = Math.round(margin * 0.8);
                    el.marginBottom = Math.round(margin * 0.2);
                    el.color = fontColor;
                }
                return el;
            });

            this.el.childList.setItems(els);
        }
    }
}

Delegator.delegate(Paragraph, TextTextureSettings, "settings");
interface Paragraph extends TextTextureSettings {}

export { Paragraph };
