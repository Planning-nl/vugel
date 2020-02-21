"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Base_1 = __importDefault(require("./Base"));
class Node extends Base_1.default {
    constructor(stage, base) {
        super(base || new lng.Element(stage));
        this.stage = stage;
    }
    appendChild(child) {
        super.appendChild(child);
        if (child.element) {
            this.element.childList.add(child.element);
        }
    }
    removeChild(child) {
        super.removeChild(child);
        if (child.element) {
            this.element.childList.remove(child.element);
        }
    }
    insertBefore(child, anchor) {
        super.insertBefore(child, anchor);
        if (child.element) {
            const baseAnchor = this.getBaseAnchor(anchor);
            if (baseAnchor) {
                this.element.childList.insertBefore(child, baseAnchor);
            }
            else {
                this.element.childList.add(child.element, true);
            }
        }
    }
    /**
     * Returns the nearest base that has an element.
     * @param anchor
     */
    getBaseAnchor(anchor) {
        if (anchor.element) {
            return anchor;
        }
        else {
            // In case of a v-for with a lot of elements, lastIndexOf will perform faster.
            let index = this.children.lastIndexOf(anchor);
            if (index !== -1) {
                const n = this.children.length;
                while (++index < n) {
                    if (this.children[index].element) {
                        return this.children[index];
                    }
                }
            }
            return undefined;
        }
    }
    clearChildren() {
        this.children.forEach(child => (child.parentNode = undefined));
        this.children = [];
        this.element.childList.clear();
    }
    set onActive(v) {
        if (v === undefined || isFunction(v)) {
            this.element.onActive = v;
        }
    }
    set x(v) {
        this.element.x = ensureFloat(v);
    }
    set y(v) {
        this.element.y = ensureFloat(v);
    }
    set scale(v) {
        this.scaleX = ensureFloat(v);
        this.scaleY = ensureFloat(v);
    }
    set scaleX(v) {
        this.element.scaleX = ensureFloat(v);
    }
    set scaleY(v) {
        this.element.scaleY = ensureFloat(v);
    }
    set rotation(v) {
        this.element.rotation = ensureFloat(v);
    }
    set alpha(v) {
        this.element.alpha = ensureFloat(v);
    }
    set visible(v) {
        this.element.visible = ensureBoolean(v);
    }
    set color(v) {
        this.element.color = ensureInt(v);
    }
    set w(v) {
        this.element.w = ensureFloat(v);
    }
    set h(v) {
        this.element.h = ensureFloat(v);
    }
}
exports.default = Node;
function ensureInt(v) {
    return parseInt(v) || 0;
}
exports.ensureInt = ensureInt;
function ensureFloat(v) {
    return parseFloat(v) || 0.0;
}
exports.ensureFloat = ensureFloat;
function ensureBoolean(v) {
    return v !== 'false' && !!v;
}
exports.ensureBoolean = ensureBoolean;
const isFunction = (val) => typeof val === 'function';
