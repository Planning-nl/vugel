import { VugelStage } from "../../wrapper";
import { Node } from "./Node";
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

type AugmentedElementEventObject<T extends Tree2dElementEventObjectBase = Tree2dElementEventObjectBase> = T & {
    stage: VugelStage;
    node: Node;
};

type Tree2dElementEventObjectBase = { element: Element };

type Tree2dElementEventCallback<EventObject extends Tree2dElementEventObjectBase> = (e: EventObject) => void;

export type GetVugelNodeEventObject<T = ElementEventCallback> = T extends Tree2dElementEventCallback<infer EventObject>
    ? AugmentedElementEventObject<EventObject>
    : never;

export type VugelNodeEventObject = GetVugelNodeEventObject<ElementEventCallback>;
export type VugelTextureErrorEventObject = GetVugelNodeEventObject<ElementTextureErrorEventCallback>;
export type VugelTextureEventObject = GetVugelNodeEventObject<ElementTextureEventCallback>;
export type VugelResizeEventObject = GetVugelNodeEventObject<ElementResizeEventCallback>;

type GetVugelNodeEventListener<EventObject> = (event: EventObject) => void;
export type VugelNodeEventListener = GetVugelNodeEventListener<VugelNodeEventObject>;
export type VugelTextureErrorEventListener = GetVugelNodeEventListener<VugelTextureErrorEventObject>;
export type VugelTextureEventListener = GetVugelNodeEventListener<VugelTextureEventObject>;
export type VugelResizeEventListener = GetVugelNodeEventListener<VugelResizeEventObject>;
