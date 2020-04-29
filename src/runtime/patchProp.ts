import { ComponentInternalInstance, SuspenseBoundary, VNode } from "@vue/runtime-core";
import { Element } from "tree2d";

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
    getSetter(key)(el, nextValue);
}

type SetterFunction = (el: any, value: any) => void;

const obj: Record<string, SetterFunction> = {};

const getSetter = (key: string) => {
    if (!obj[key]) {
        obj[key] = new Function("el", "value", `el["${key}"] = value`) as SetterFunction;
    }
    return obj[key];
};
