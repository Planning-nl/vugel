"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const props_1 = require("./modules/props");
function patchProp(el, key, nextValue, prevValue, isSVG, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    props_1.patchElProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
}
exports.patchProp = patchProp;
