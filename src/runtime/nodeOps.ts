import types from "./nodes/types";
import Base from "./nodes/Base";
import Comment from "./nodes/Comment";
import { RendererOptions } from "@vue/runtime-core";

export const nodeOps = (stage: typeof lng.Stage): Omit<RendererOptions<Base, Base>, "patchProp"> => ({
    insert: (child, parent, anchor) => {
        if (anchor != null) {
            parent.insertBefore(child, anchor);
        } else {
            parent.appendChild(child);
        }
    },

    remove: child => {
        const parent = child.parentNode;
        if (parent != null) {
            parent.removeChild(child);
        }
    },

    createElement: (tag, isSVG) => {
        const type = types[tag];
        return new type(stage);
    },

    createText: text => {
        // @todo: return Text element.
        return null as any;
    },

    createComment: text => {
        // @todo: nothing. Can we ignore these?
        return new Comment(text);
    },

    setText: (node, text) => {},

    setElementText: (node, text) => {},

    parentNode: node => (node.parentNode ? node.parentNode : null),

    nextSibling: node => node.nextSibling,

    querySelector: selector => null,

    setScopeId(el, id) {
        if (el.element) {
            el.element.ref = id;
        }
    }
});
