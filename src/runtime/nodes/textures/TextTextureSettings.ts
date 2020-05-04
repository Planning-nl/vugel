import { ensureFloat } from "../../utils/TypeUtils";
import { TextSettings } from "tree2d";

export class TextTextureSettings {
    public readonly textSettings: Partial<TextSettings> = {};

    constructor(private onChange: () => void) {}

    get "font-size"() {
        return this.textSettings.fontSize || 40;
    }

    set "font-size"(v: number) {
        this.textSettings.fontSize = ensureFloat(v);
        this.onChange();
    }

    get "font-style"() {
        return this.textSettings.fontStyle || "normal";
    }

    set "font-style"(v: string) {
        this.textSettings.fontStyle = v;
        this.onChange();
    }

    get "font-weight"() {
        return this.textSettings.fontWeight || 400;
    }

    set "font-weight"(v: number) {
        this.textSettings.fontWeight = ensureFloat(v);
        this.onChange();
    }

    get "font-face"() {
        return this.textSettings.fontFace || [];
    }

    set "font-face"(v: string | string[]) {
        if (!Array.isArray(v)) {
            v = [v];
        }
        this.textSettings.fontFace = v;
        this.onChange();
    }
}
