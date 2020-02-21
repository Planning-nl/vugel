"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const makeMap_1 = require("./makeMap");
exports.parserOptionsMinimal = {
    isVoidTag: () => false,
    isNativeTag: tag => exports.isLightningTag(tag),
    isPreTag: () => false
};
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const LIGHTNING_TAGS = 'root,node,image,rect,text';
exports.isLightningTag = makeMap_1.makeMap(LIGHTNING_TAGS);
