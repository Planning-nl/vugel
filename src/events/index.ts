import { Stage } from "tree2d/lib";
import { mouseEventTranslator, SupportedMouseEvents } from "./mouseEvents";
import { Node } from "../runtime/nodes/Node";
import { Events } from "@vue/runtime-dom";
import { ElementCoordinatesInfo } from "tree2d/lib";
import { SupportedTouchEvents, touchEventTranslator } from "./touchEvents";

export type SupportedEvents = SupportedMouseEvents | SupportedTouchEvents;

export interface VugelEvent<T extends Event> {
    cancelBubble: boolean;
    readonly currentTarget: Node | null;
    readonly target: Node | null;
    readonly type: SupportedEvents;
    readonly originalEvent: T;
}

export const eventTranslators = {
    ...mouseEventTranslator,
    ...touchEventTranslator,
} as const;

// Type helpers
export type RegisterEventDispatcher = (canvasElement: HTMLCanvasElement, stage: Stage) => any;

export type EventTranslator<O extends Event, V extends VugelEvent<Event>> = (
    stage: Stage,
    event: O,
) => {
    event: V;
    currentElement: ElementCoordinatesInfo<Node> | undefined;
};

export type VugelEventListener<T extends VugelEvent<Event>> = (event: T) => any;

export type VueEventsOfType<T extends Event> = keyof Pick<
    Events,
    {
        [K in keyof Events]: Events[K] extends T ? (T extends Events[K] ? K : never) : never;
    }[keyof Events]
>;

export * from "./mouseEvents";
export * from "./touchEvents";
