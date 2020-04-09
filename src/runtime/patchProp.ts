import { ComponentInternalInstance, SuspenseBoundary, VNode } from "@vue/runtime-core";
import { patchElProp } from "./modules/props";

export function patchProp(
    el: Element,
    key: string,
    prevValue: any,
    nextValue: any,
    isSVG: boolean,
    prevChildren?: VNode[],
    parentComponent?: ComponentInternalInstance,
    parentSuspense?: SuspenseBoundary,
    unmountChildren?: any,
) {
    key = convertDashedToCamelCase(key);
    patchElProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
}

function convertDashedToCamelCase(key: string) {
    if (key.indexOf("-") !== -1) {
        const parts = key.split("-");
        let result = parts[0];
        const n = parts.length;
        let i = 1;
        while (i < n) {
            const part = parts[i];
            const l = part.length;
            if (l) {
                result += part.charAt(0).toUpperCase();
            }
            if (l > 1) {
                result += part.substr(1);
            }
            i++;
        }
        return result;
    } else {
        return key;
    }
}
