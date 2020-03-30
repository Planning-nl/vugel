import Node from "../runtime/nodes/Node";
import { VugelEventDispatcher, VugelEventTranslator } from "./index";

/**
 * TODO
 * - Provide the correct target node, right now it'll be the canvas. Maybe we should define our custom events, given that many fields of the DOM events will be invalid.
 * - mouseenter: also dispatch on mouse move by keeping track of currently entered nodes
 * - mouseleave: also dispatch on mouse move by keeping track of currently entered nodes
 * - mouseout: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseleave is that it also fires when entering/leaving child components
 * - mouseover: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseenter is that it also fires when entering/leaving child components
 */
export const dispatchMouseEvent: VugelEventDispatcher<MouseEvent> = (stage) => {
    return (e) => {
        const target = e.target as HTMLElement;
        if (!target) return;

        const rect = target.getBoundingClientRect();

        const canvasX = e.pageX - rect.left;
        const canvasY = e.pageY - rect.top;

        const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
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

export const mouseEventTranslator: VugelEventTranslator<MouseEvents, MouseEvent> = {
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
