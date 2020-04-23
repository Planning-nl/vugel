import { ensureFloat } from "../../utils/TypeUtils";
import { TextSettings } from "tree2d";

export class TextTextureSettings {
    public readonly textSettings: Partial<TextSettings> = {};

    constructor(private onChange: () => void) {}

    set "font-size"(v: number) {
        this.textSettings.fontSize = ensureFloat(v);
        this.onChange();
    }

    set "font-style"(v: string) {
        this.textSettings.fontStyle = v;
        this.onChange();
    }

    set "font-weight"(v: number) {
        this.textSettings.fontWeight = ensureFloat(v);
        this.onChange();
    }

    set "font-face"(v: string | string[]) {
        if (!Array.isArray(v)) {
            v = [v];
        }
        this.textSettings.fontFace = v;
        this.onChange();
    }

    set "cut-start-x"(v: number) {
        this.textSettings.cutSx = ensureFloat(v);
        this.onChange();
    }

    set "cut-start-y"(v: number) {
        this.textSettings.cutSy = ensureFloat(v);
        this.onChange();
    }

    set "cut-end-x"(v: number) {
        this.textSettings.cutEx = ensureFloat(v);
        this.onChange();
    }

    set "cut-end-y"(v: number) {
        this.textSettings.cutEy = ensureFloat(v);
        this.onChange();
    }
}
