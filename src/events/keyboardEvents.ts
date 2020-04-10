import { EventTranslator, VueEventsOfType, VugelEvent } from "./index";
import { Node } from "../runtime/nodes/Node";
import { VugelStage } from "../wrapper";

export interface VugelKeyboardEvent extends VugelEvent<KeyboardEvent> {}

const translateEvent: EventTranslator<KeyboardEvent, VugelKeyboardEvent> = (stage, e) => {
    let currentNode: Node | undefined = stage.eventHelpers.focusManager.getFocusedNode();
    if (!currentNode) {
        currentNode = stage.root.data;
    }

    return {
        cancelBubble: false,

        // Event
        type: e.type as SupportedKeyboardEvents,
        currentTarget: currentNode ?? null,
        target: currentNode ?? null,

        originalEvent: e,
    };
};

// https://www.w3.org/TR/uievents/#events-keyboardevents
const dispatchKeyboardEvent = (stage: VugelStage) => {
    return (e: KeyboardEvent) => {
        const translatedEvent = translateEvent(stage, e);
        if (translatedEvent) {
            dispatchVugelKeyboardEvent(translatedEvent);
        }
    };
};

export const dispatchVugelKeyboardEvent = (translatedEvent: VugelKeyboardEvent) => {
    translatedEvent.target?.dispatchBubbledEvent(translatedEvent);
};

export type SupportedKeyboardEvents = keyof Pick<GlobalEventHandlersEventMap, "keypress" | "keydown" | "keyup">;

export const keyboardEventTranslator: {
    [x in SupportedKeyboardEvents]: VueEventsOfType<KeyboardEvent>;
} = {
    keypress: "onKeypress",
    keydown: "onKeydown",
    keyup: "onKeyup",
} as const;

export const setupKeyboardEvents = (canvasElement: HTMLCanvasElement, stage: VugelStage) => {
    for (const key in keyboardEventTranslator) {
        canvasElement.addEventListener(key, dispatchKeyboardEvent(stage) as EventListener);
    }
};
