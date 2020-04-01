import { RegisterEventDispatcher, VueEventsOfType, VugelEvent } from "./index";
import { Stage } from "tree2d";
import Node from "../runtime/nodes/Node";
import { ElementCoordinatesInfo } from "tree2d";

/**
 * The touch event as emitted by vugel.
 *
 * @remarks Every property in this interface has the same meaning as the one found in the DOM {@link TouchEvent}
 */
export interface VugelTouchEvent extends VugelEvent<TouchEvent> {
    readonly altKey: boolean;
    readonly changedTouches: TouchList;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly shiftKey: boolean;
    readonly targetTouches: TouchList;
    readonly touches: TouchList;
}

const translateEvent = (stage: Stage, e: TouchEvent): [VugelTouchEvent, ElementCoordinatesInfo<Node>] | undefined => {
    // TODO
    return;
};

const dispatchTouchEvent = (stage: Stage) => {
    return (e: TouchEvent) => {
        switch (e.type as SupportedTouchEvents) {
            case "touchcancel":
                // TODO
                break;
            case "touchend":
                // TODO
                break;
            case "touchmove":
                // TODO
                break;
            case "touchstart":
                // TODO
                break;
        }
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

export const registerTouchEventDispatchers: RegisterEventDispatcher = (canvasElement, stage) => {
    for (const key in touchEventTranslator) {
        canvasElement.addEventListener(key, dispatchTouchEvent(stage) as EventListener);
    }
};
