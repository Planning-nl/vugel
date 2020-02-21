"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compileToFunction_1 = __importDefault(require("./compiler/compileToFunction"));
exports.compileVugel = compileToFunction_1.default;
exports.tpl = compileToFunction_1.default;
__export(require("./wrapper"));
var compile_1 = require("./compiler/compile");
exports.compile = compile_1.compile;
exports.parse = compile_1.parse;
