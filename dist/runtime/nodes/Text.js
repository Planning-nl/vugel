"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importStar(require("./Node"));
class Text extends Node_1.default {
    constructor(stage) {
        super(stage);
        this.element.texture = new lng.textures.TextTexture(stage);
    }
    set text(value) {
        this.element.texture.text = value;
    }
    set fontSize(value) {
        this.element.texture.fontSize = Node_1.ensureFloat(value);
    }
}
exports.default = Text;
