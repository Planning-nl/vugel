import { types } from "./nodes/types";
import { Base } from "./nodes/Base";
import { Comment } from "./nodes/Comment";
import { RendererOptions } from "@vue/runtime-core";
import { TextNode } from "./nodes/TextNode";
import { VugelStage } from "../wrapper";

export const nodeOps = (stage: VugelStage): Omit<RendererOptions<Base, Base>, "patchProp"> => ({
    insert: (child, parent, anchor) => {
        if (anchor != null) {
            parent._insertBefore(child, anchor);
        } else {
            parent._appendChild(child);
        }
    },

    remove: (child) => {
        const parent = child.parent;
        if (parent != null) {
            parent._removeChild(child);
        }
    },

    createElement: (tag: keyof typeof types, isSVG) => {
        let type = types[tag];
        if (!type) {
            console.warn(`Unknown native tag: ${tag}`);
            type = types["container"];
        }
        return new type(stage);
    },

    createText: (text) => {
        return new TextNode(text);
    },

    createComment: (text) => {
        return new Comment(text);
    },

    setText: (node, text) => {
        // Noop
    },

    setElementText: (node, text) => {
        node.setElementText(text);
    },

    parentNode: (node) => (node.parent ? node.parent : null),

    nextSibling: (node) => node.nextSibling,

    querySelector: (selector) => {
        if (selector.startsWith("#")) {
            selector = selector.substr(1);
        }
        return stage.getById(selector)?.data || null;
    },
});
