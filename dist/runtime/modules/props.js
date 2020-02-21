"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function patchElProp(el, key, value, 
// the following args are passed only due to potential innerHTML/textContent
// overriding existing VNodes, in which case the old tree must be properly
// unmounted.
prevChildren, parentComponent, parentSuspense, unmountChildren) {
    el[key] = value;
}
exports.patchElProp = patchElProp;
