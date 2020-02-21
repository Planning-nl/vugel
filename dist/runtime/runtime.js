"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_core_1 = require("@vue/runtime-core");
const nodeOps_1 = require("./nodeOps");
const patchProp_1 = require("./patchProp");
function createRendererForStage(stage) {
    const { render } = runtime_core_1.createRenderer(Object.assign({ patchProp: patchProp_1.patchProp }, nodeOps_1.nodeOps(stage)));
    const vugelRender = render;
    return vugelRender;
}
exports.createRendererForStage = createRendererForStage;
// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
__export(require("@vue/runtime-core"));
