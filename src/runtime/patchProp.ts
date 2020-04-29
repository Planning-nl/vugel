import { ComponentInternalInstance, SuspenseBoundary, VNode } from "@vue/runtime-core";
import { Base } from "./nodes/Base";

export function patchProp(
    el: Base,
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

type SetterFunction = (el: Base, value: any) => void;

const obj: Record<string, SetterFunction> = {};

const getSetter = (key: string) => {
    if (!obj[key]) {
        obj[key] = new Function("el", "value", `el["${key}"] = value`) as SetterFunction;
    }
    return obj[key];
};
