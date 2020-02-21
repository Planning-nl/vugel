"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __importDefault(require("./nodes/types"));
const Comment_1 = __importDefault(require("./nodes/Comment"));
exports.nodeOps = (stage) => ({
    insert: (child, parent, anchor) => {
        if (anchor != null) {
            parent.insertBefore(child, anchor);
        }
        else {
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
        const type = types_1.default[tag];
        return new type(stage);
    },
    createText: text => {
        // @todo: return Text element.
        return null;
    },
    createComment: text => {
        // @todo: nothing. Can we ignore these?
        return new Comment_1.default(text);
    },
    setText: (node, text) => {
    },
    setElementText: (node, text) => {
    },
    parentNode: node => node.parentNode ? node.parentNode : null,
    nextSibling: node => node.nextSibling,
    querySelector: selector => null,
    setScopeId(el, id) {
        if (el.element) {
            el.element.ref = id;
        }
    }
});
