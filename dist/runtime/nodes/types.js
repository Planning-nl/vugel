"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Node_1 = __importDefault(require("./Node"));
const Image_1 = __importDefault(require("./Image"));
const Rect_1 = __importDefault(require("./Rect"));
const Text_1 = __importDefault(require("./Text"));
const types = {
    node: Node_1.default,
    image: Image_1.default,
    rect: Rect_1.default,
    text: Text_1.default
};
exports.default = types;
