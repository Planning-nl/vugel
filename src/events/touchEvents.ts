import Node from "../runtime/nodes/Node";
import { VugelEventDispatcher, VugelEventTranslator } from "./index";

export const dispatchTouchEvent: VugelEventDispatcher<TouchEvent> = (stage) => {
    return (e) => {
        const touches: Touch[] = [];
        for (let i = 0; i < e.touches.length; i++) {
            const currentTouch = e.touches[i];

            const canvasX = currentTouch.clientX;
            const canvasY = currentTouch.clientY;

            const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
            const elementsAtCanvasCoordinate = elementsAtCanvasCoordinates.find(
                (v) => v.element.data?.pointerEvents == true,
            );

            if (elementsAtCanvasCoordinate) {
                touches.push(
                    new Touch({
                        ...currentTouch,
                        clientX: elementsAtCanvasCoordinate.offsetX,
                        clientY: elementsAtCanvasCoordinate.offsetY,
                        screenX: currentTouch.clientX,
                        screenY: currentTouch.clientY,
                    }),
                );

                const vOnEvent = touchEventTranslator[e.type as keyof GlobalEventHandlersEventMap];
                if (vOnEvent) {
                    elementsAtCanvasCoordinate.element.data?.[vOnEvent[0]]?.(
                        new TouchEvent(e.type, {
                            ...e,
                            targetTouches: undefined,
                            changedTouches: undefined,
                            touches,
                        }),
                    );
                }
            }
        }
    };
};

export type TouchEvents = "onTouchcancel" | "onTouchend" | "onTouchmove" | "onTouchstart";

export const touchEventTranslator: VugelEventTranslator<TouchEvents, TouchEvent> = {
    touchcancel: ["onTouchcancel", dispatchTouchEvent],
    touchend: ["onTouchend", dispatchTouchEvent],
    touchmove: ["onTouchmove", dispatchTouchEvent],
    touchstart: ["onTouchstart", dispatchTouchEvent],
};
