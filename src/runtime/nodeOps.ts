import { types } from "./nodes/types";
import { Base } from "./nodes/Base";
import { Comment } from "./nodes/Comment";
import { RendererOptions } from "@vue/runtime-core";
import { TextNode } from "./nodes/TextNode";
import { VugelStage } from "../wrapper";

export const nodeOps = (stage: VugelStage): Omit<RendererOptions<Base, Base>, "patchProp"> => ({
    insert: (child, parent, anchor) => {
        if (anchor != null) {
            parent.insertBefore(child, anchor);
        } else {
            parent.appendChild(child);
        }
    },

    remove: (child) => {
        const parent = child.parent;
        if (parent != null) {
            parent.removeChild(child);
        }
    },

    createElement: (tag: keyof typeof types, isSVG) => {
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

    parentNode: (node) => (node.parent ? node.parent : null),

    nextSibling: (node) => node.nextSibling,

    querySelector: (selector) => null,

    setScopeId(el, id) {
        if (el.element) {
            el.element.ref = id;
        }
    },
});
