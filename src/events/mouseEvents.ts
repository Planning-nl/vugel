import Node, { VOnEventHandlers } from "../runtime/nodes/Node";
import { EventDispatcher, EventTranslator } from "./index";

export const dispatchMouseEvent: EventDispatcher<MouseEvent> = (stage) => {
    return (e) => {
        const canvasX = e.clientX;
        const canvasY = e.clientY;

        const elementsAtCanvasCoordinates = stage.getElementsAtCanvasCoordinates<Node>(canvasX, canvasY);
        const elementsAtCanvasCoordinate = elementsAtCanvasCoordinates.find(
            (v) => v.element.data?.pointerEvents == true,
        );

        const vOnEvent = mouseEventTranslator[e.type as keyof GlobalEventHandlersEventMap];
        if (vOnEvent) {
            elementsAtCanvasCoordinate?.element.data?.[vOnEvent[0]]?.(
                new MouseEvent(e.type, {
                    ...e,
                    clientX: elementsAtCanvasCoordinate.offsetX,
                    clientY: elementsAtCanvasCoordinate.offsetY,
                    screenX: e.clientX,
                    screenY: e.clientY,
                }),
            );
        }
    };
};

export type MouseEvents =
    | "onMousedown"
    | "onMouseenter"
    | "onMouseleave"
    | "onMousemove"
    | "onMouseout"
    | "onMouseover"
    | "onMouseup";

export type VOnMouseEventHandlers = VOnEventHandlers<MouseEvent, MouseEvents>;

export const mouseEventTranslator: EventTranslator<MouseEvents> = {
    mousedown: ["onMousedown", dispatchMouseEvent],
    mouseenter: ["onMouseenter", dispatchMouseEvent],
    mouseleave: ["onMouseleave", dispatchMouseEvent],
    mousemove: ["onMousemove", dispatchMouseEvent],
    mouseout: ["onMouseout", dispatchMouseEvent],
    mouseover: ["onMouseover", dispatchMouseEvent],
    mouseup: ["onMouseup", dispatchMouseEvent],
};
