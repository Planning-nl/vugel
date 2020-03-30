import Node, { VOnEventHandlers } from "../runtime/nodes/Node";
import { EventDispatcher, EventTranslator } from "./index";

/**
 * TODO
 * - Provide the correct target node, right now it'll be the canvas. Maybe we should define our custom events, given that many fields of the DOM events will be invalid.
 * - mouseenter: also dispatch on mouse move by keeping track of currently entered nodes
 * - mouseleave: also dispatch on mouse move by keeping track of currently entered nodes
 * - mouseout: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseleave is that it also fires when entering/leaving child components
 * - mouseover: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseenter is that it also fires when entering/leaving child components
 */
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
    | "onAuxclick"
    | "onClick"
    | "onContextmenu"
    | "onDblclick"
    | "onMousedown"
    | "onMouseenter"
    | "onMouseleave"
    | "onMousemove"
    | "onMouseout"
    | "onMouseover"
    | "onMouseup";

export type VOnMouseEventHandlers = VOnEventHandlers<MouseEvent, MouseEvents>;

export const mouseEventTranslator: EventTranslator<MouseEvents> = {
    auxclick: ["onAuxclick", dispatchMouseEvent],
    click: ["onClick", dispatchMouseEvent],
    contextmenu: ["onContextmenu", dispatchMouseEvent],
    dblclick: ["onDblclick", dispatchMouseEvent],
    mousedown: ["onMousedown", dispatchMouseEvent],
    mouseenter: ["onMouseenter", dispatchMouseEvent],
    mouseleave: ["onMouseleave", dispatchMouseEvent],
    mousemove: ["onMousemove", dispatchMouseEvent],
    mouseout: ["onMouseout", dispatchMouseEvent],
    mouseover: ["onMouseover", dispatchMouseEvent],
    mouseup: ["onMouseup", dispatchMouseEvent],
};
