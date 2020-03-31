import { ParserOptions } from "@vue/compiler-core";
import { makeMap } from "./makeMap";

export const parserOptionsMinimal: ParserOptions = {
    isVoidTag: () => false,
    isNativeTag: (tag) => {
        return isTree2dTag(tag);
    },
    isPreTag: () => false,
};

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element
const TREE2D_TAGS = "root,node,image,rect,text,paragraph";

export const isTree2dTag = /*#__PURE__*/ makeMap(TREE2D_TAGS);
