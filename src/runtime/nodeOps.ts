import types from "./nodes/types";
import Base from "./nodes/Base";
import Comment from "./nodes/Comment";
import { RendererOptions } from "@vue/runtime-core";
import { Stage } from "tree2d";
import TextNode from "./nodes/TextNode";

export const nodeOps = (stage: Stage): Omit<RendererOptions<Base, Base>, "patchProp"> => ({
    insert: (child, parent, anchor) => {
        if (anchor != null) {
            parent.insertBefore(child, anchor);
        } else {
            parent.appendChild(child);
        }
    },

    remove: (child) => {
        const parent = child.parentNode;
        if (parent != null) {
            parent.removeChild(child);
        }
    },

    createElement: (tag, isSVG) => {
        const type = types[tag];
        return new type(stage);
    },

    createText: (text) => {
        return new TextNode(text);
    },

    createComment: (text) => {
        return new Comment(text);
    },

    setText: (node, text) => {},

    setElementText: (node, text) => {
        node.setElementText(text);
    },

    parentNode: (node) => (node.parentNode ? node.parentNode : null),

    nextSibling: (node) => node.nextSibling,

    querySelector: (selector) => null,

    setScopeId(el, id) {
        if (el.element) {
            el.element.ref = id;
        }
    },
});
