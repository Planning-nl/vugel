"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base {
    constructor(element) {
        this.children = [];
        this.parentNode = undefined;
        this.nextSibling = null;
        this.element = element;
    }
    appendChild(child) {
        child.parentNode = this;
        this.children.push(child);
        child.nextSibling = null;
    }
    removeChild(child) {
        child.parentNode = undefined;
        const index = this.children.indexOf(child);
        if (index > 0) {
            this.children[index - 1].nextSibling = child.nextSibling;
        }
        this.children.splice(index, 1);
        child.nextSibling = null;
    }
    insertBefore(child, anchor) {
        child.parentNode = this;
        const index = this.children.lastIndexOf(anchor);
        if (index > 0) {
            this.children[index - 1].nextSibling = child;
        }
        this.children.splice(index, 0, child);
        child.nextSibling = anchor;
    }
    clearChildren() {
        this.children.forEach(child => {
            child.parentNode = undefined;
            child.nextSibling = null;
        });
        this.children = [];
    }
}
exports.default = Base;
