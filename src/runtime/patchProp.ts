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
    patchElProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
}