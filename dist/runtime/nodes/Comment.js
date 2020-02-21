"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class Comment extends Base_1.default {
    constructor(text) {
        super(undefined);
        this.text = text;
    }
}
exports.default = Comment;
