import { ParserOptions } from "@vue/compiler-core";
import { makeMap } from "./makeMap";

export const parserOptionsMinimal: ParserOptions = {
    isVoidTag: () => false,
    isNativeTag: tag => isLightningTag(tag),
    isPreTag: () => false
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const LIGHTNING_TAGS = "root,node,image,rect,text";

export const isLightningTag = /*#__PURE__*/ makeMap(LIGHTNING_TAGS);
