import {
    dispatchVugelMouseEvent,
    EventTranslator,
    MouseEventState,
    RegisterEventDispatcher,
    SupportedMouseEvents,
    VueEventsOfType,
    VugelMouseEvent,
} from "./index";
import { getCurrentContext } from "./utils";
import { VugelStage } from "../wrapper";

const translateEvent: EventTranslator<TouchEvent, VugelMouseEvent> = (stage, e) => {
    let currentTouch: Touch;

    const eventType = e.type as SupportedTouchEvents;
    if (eventType === "touchend" || eventType === "touchcancel") {
        currentTouch = e.changedTouches[0];
    } else {
        currentTouch = e.touches[0];
    }

    const { currentElement, canvasOffsetX, canvasOffsetY } = getCurrentContext(currentTouch, stage);
    const currentNode = currentElement?.element.data;

    return {
        cancelBubble: false,

        // Event
        type: e.type as SupportedMouseEvents,
        currentTarget: currentNode ?? null,
        target: currentNode ?? null,

        // MouseEvent
        canvasOffsetX: canvasOffsetX,
        canvasOffsetY: canvasOffsetY,
        elementOffsetX: currentElement?.offsetX ?? 0,
        elementOffsetY: currentElement?.offsetY ?? 0,

        originalEvent: e,
        currentElement: currentElement,
    };
};

// https://www.w3.org/TR/touch-events/#list-of-touchevent-types
const dispatchTouchEvent = (stage: VugelStage, eventState: MouseEventState) => {
    return (e: TouchEvent) => {
        const translatedEvent = translateEvent(stage, e);
        let correspondingMouseEvent: SupportedMouseEvents;

        switch (e.type as SupportedTouchEvents) {
            case "touchstart":
                correspondingMouseEvent = "mousedown";
                break;
            case "touchend":
            case "touchcancel":
                correspondingMouseEvent = "mouseup";
                break;
            case "touchmove":
                correspondingMouseEvent = "mousemove";
                break;
        }

        const translatedMouseEvent: VugelMouseEvent = {
            ...translatedEvent,
            type: correspondingMouseEvent,
            currentElement: translatedEvent.currentElement,
        };

        dispatchVugelMouseEvent(translatedMouseEvent, eventState);
    };
};

export type SupportedTouchEvents = keyof Pick<
    GlobalEventHandlersEventMap,
    "touchcancel" | "touchend" | "touchstart" | "touchmove"
>;

export const touchEventTranslator: {
    [x in SupportedTouchEvents]: VueEventsOfType<TouchEvent>;
} = {
    touchcancel: "onTouchcancel",
    touchend: "onTouchend",
    touchmove: "onTouchmove",
    touchstart: "onTouchstart",
} as const;

export const setupTouchEvents: RegisterEventDispatcher = (targetElement, stage) => {
    const eventState: MouseEventState = {};

    for (const key in touchEventTranslator) {
        targetElement.addEventListener(key, dispatchTouchEvent(stage, eventState) as EventListener);
    }
};
