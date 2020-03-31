import Stage from "tree2d/dist/tree/Stage";
import { SupportedMouseEvents } from "./mouseEvents";
import Node from "../runtime/nodes/Node";
import { Events } from "@vue/runtime-dom";
import { ElementCoordinatesInfo } from "tree2d/dist/tree/core/ElementCore";
import { SupportedTouchEvents } from "./touchEvents";

export interface VugelEvent {
    readonly currentTarget: Node | null;
    readonly target: Node | null;
    readonly type: SupportedMouseEvents | keyof SupportedTouchEvents;
}

export type RegisterEventDispatcher = (canvasElement: HTMLCanvasElement, stage: Stage) => any;

export type EventTranslator<O extends Event, V extends VugelEvent> = (
    stage: Stage,
    event: O,
) => {
    event: V;
    topLevelElement: ElementCoordinatesInfo<Node> | undefined;
};

export type VugelEventListener<T extends VugelEvent> = (event: T) => any;

export type VueEventsOfType<T extends Event> = keyof Pick<
    Events,
    {
        [K in keyof Events]: Events[K] extends T ? (T extends Events[K] ? K : never) : never;
    }[keyof Events]
>;
