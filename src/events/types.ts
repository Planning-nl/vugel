import { mouseEventTranslator, SupportedMouseEvents } from "./mouseEvents";
import { Node } from "../runtime/nodes/Node";
import { Events } from "@vue/runtime-dom";
import { ElementCoordinatesInfo } from "tree2d/lib";
import { SupportedTouchEvents, touchEventTranslator } from "./touchEvents";
import { VugelStage } from "../wrapper";
import { focusEventTranslator, SupportedFocusEvents } from "./focusEvents";
import { keyboardEventTranslator, SupportedKeyboardEvents } from "./keyboardEvents";

export type SupportedEvents =
    | SupportedMouseEvents
    | SupportedTouchEvents
    | SupportedFocusEvents
    | SupportedKeyboardEvents;

export interface VugelEvent<T extends Event | undefined = undefined> {
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
    ...keyboardEventTranslator,
} as const;

// Type helpers
export type RegisterEventDispatcher = (canvasElement: HTMLCanvasElement, stage: VugelStage) => any;

export type EventTranslator<O extends Event, V extends VugelEvent<Event>> = (stage: VugelStage, event: O) => V;

export type VugelEventListener<T extends VugelEvent<any>> = (event: T) => any;

export type VueEventsOfType<T extends Event> = keyof Pick<
    Events,
    {
        [K in keyof Events]: Events[K] extends T ? (T extends Events[K] ? K : never) : never;
    }[keyof Events]
>;
