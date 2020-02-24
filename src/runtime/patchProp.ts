import { ComponentInternalInstance, SuspenseBoundary, VNode } from "@vue/runtime-core";
import { patchElProp } from "./modules/props";

export function patchProp(
    el: Element,
    key: string,
    nextValue: any,
    prevValue: any,
    isSVG: boolean,
    prevChildren?: VNode[],
    parentComponent?: ComponentInternalInstance,
    parentSuspense?: SuspenseBoundary<Node, Element>,
    unmountChildren?: any
) {
    patchElProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
}
