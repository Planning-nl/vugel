"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
class Image extends Node_1.default {
    constructor(stage) {
        super(stage);
        this.element.texture = new lng.textures.ImageTexture(stage);
    }
    set src(value) {
        this.element.texture.src = value;
    }
}
exports.default = Image;
