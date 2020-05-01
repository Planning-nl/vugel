import { VugelStage } from "../wrapper";
import { Node } from "./nodes";
import {
    ElementEventCallback,
    ElementTextureErrorEventCallback,
    ElementTextureEventCallback,
    ElementResizeEventCallback,
} from "tree2d";
import { Element } from "tree2d";

export function augmentTree2dElementEvent<T extends Tree2dElementEventObjectBase>(
    e: T,
): AugmentedElementEventObject<T> {
    const node = e.element.data as Node;
    const stage = node.stage;
    return { ...e, node, stage };
}

type Tree2dElementEventObjectBase = { element: Element };

type Tree2dElementEventCallback<EventObject extends Tree2dElementEventObjectBase> = (e: EventObject) => void;

type AugmentedElementEventObject<T extends Tree2dElementEventObjectBase = Tree2dElementEventObjectBase> = T & {
    stage: VugelStage;
    node: Node;
};
export type GetVugelNodeEventListener<T = ElementEventCallback> = T extends Tree2dElementEventCallback<infer EventArg>
    ? (event: AugmentedElementEventObject<EventArg>) => void
    : never;

export type VugelNodeEventListener = (event: { element: Element; node: Node; stage: VugelStage }) => void;

export type VugelTextureErrorEventListener = GetVugelNodeEventListener<ElementTextureErrorEventCallback>;
export type VugelTextureEventListener = GetVugelNodeEventListener<ElementTextureEventCallback>;
export type VugelResizeEventListener = GetVugelNodeEventListener<ElementResizeEventCallback>;
