"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_core_1 = require("@vue/compiler-core");
const parserOptionsMinimal_1 = require("./parserOptionsMinimal");
const parserOptions = parserOptionsMinimal_1.parserOptionsMinimal;
function compile(template, options = {}) {
    return compiler_core_1.baseCompile(template, Object.assign({}, parserOptions, options, { nodeTransforms: [...(options.nodeTransforms || [])], directiveTransforms: Object.assign({}, (options.directiveTransforms || {})) }));
}
exports.compile = compile;
function parse(template, options = {}) {
    return compiler_core_1.baseParse(template, Object.assign({}, parserOptions, options));
}
exports.parse = parse;
__export(require("@vue/compiler-core"));
