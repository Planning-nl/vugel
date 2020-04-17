import { ParserOptions } from "@vue/compiler-core";
import { makeMap } from "./makeMap";

export const parserOptionsMinimal: ParserOptions = {
    isVoidTag: () => false,
    isNativeTag: (tag) => {
        return isTree2dTag(tag);
    },
    isPreTag: () => false,
};

const TREE2D_TAGS =
    "container,rectangle,picture,text,paragraph,special-rectangle,drawing,texture,svg,grayscale,rounded,shader,box-blur";

export const isTree2dTag = makeMap(TREE2D_TAGS);
