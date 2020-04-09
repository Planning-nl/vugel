import { Stage } from "tree2d/lib";
import { mouseEventTranslator, SupportedMouseEvents } from "./mouseEvents";
import { Node } from "../runtime/nodes/Node";
import { Events } from "@vue/runtime-dom";
import { ElementCoordinatesInfo } from "tree2d/lib";
import { SupportedTouchEvents, touchEventTranslator } from "./touchEvents";
import { focusEventTranslator, SupportedFocusEvents } from "./focus/FocusManager";

export type SupportedEvents = SupportedMouseEvents | SupportedTouchEvents | SupportedFocusEvents;

export interface VugelEvent<T extends (Event | undefined) = undefined> {
    cancelBubble: boolean;
    readonly currentTarget: Node | null;
    readonly target: Node | null;
    readonly type: SupportedEvents;
    readonly originalEvent: T;
}

export const eventTranslators = {
    ...mouseEventTranslator,
    ...touchEventTranslator,
    ...focusEventTranslator,
} as const;

// Type helpers
export type RegisterEventDispatcher = (canvasElement: HTMLCanvasElement, stage: Stage) => any;

export type TranslatedEvent<V extends VugelEvent<Event>> = {
    event: V;
    currentElement: ElementCoordinatesInfo<Node> | undefined;
};

export type EventTranslator<O extends Event, V extends VugelEvent<Event>> = (
    stage: Stage,
    event: O,
) => TranslatedEvent<V>;

export type VugelEventListener<T extends VugelEvent<any>> = (event: T) => any;

export type VueEventsOfType<T extends Event> = keyof Pick<
    Events,
    {
        [K in keyof Events]: Events[K] extends T ? (T extends Events[K] ? K : never) : never;
    }[keyof Events]
>;
