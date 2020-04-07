import { ensureFloat } from "./Node";
import { TextSettings } from "tree2d/lib/textures/text/TextSettings";

export { TextSettings };
export class TextTextureSettings {
    public readonly textSettings: Partial<TextSettings> = {};

    constructor(private onChange: () => void) {}

    set fontSize(v: number) {
        this.textSettings.fontSize = ensureFloat(v);
        this.onChange();
    }

    set fontStyle(v: string) {
        this.textSettings.fontStyle = v;
        this.onChange();
    }

    set fontWeight(v: number) {
        this.textSettings.fontWeight = ensureFloat(v);
        this.onChange();
    }

    set fontFace(v: string | string[]) {
        if (!Array.isArray(v)) {
            v = [v];
        }
        this.textSettings.fontFace = v;
        this.onChange();
    }

    set cutSx(v: number) {
        this.textSettings.cutSx = ensureFloat(v);
        this.onChange();
    }

    set cutSy(v: number) {
        this.textSettings.cutSy = ensureFloat(v);
        this.onChange();
    }

    set cutEx(v: number) {
        this.textSettings.cutEx = ensureFloat(v);
        this.onChange();
    }

    set cutEy(v: number) {
        this.textSettings.cutEy = ensureFloat(v);
        this.onChange();
    }
}
