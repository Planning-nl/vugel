import Node from "../runtime/nodes/Node";
import { EventDispatcher, VueEventsOfType, VugelEvent } from "./index";
import Stage from "tree2d/dist/tree/Stage";
import { ElementCoordinatesInfo } from "tree2d/dist/tree/core/ElementCore";
import { getTargetOffset } from "./utils";

/**
 * The mouse event as emitted by vugel.
 *
 * @remarks Every property in this interface has the same meaning as the one found in the DOM {@link MouseEvent}
 */
export interface VugelMouseEvent extends VugelEvent {
    readonly altKey: boolean;
    readonly button: number;
    readonly buttons: number;
    readonly clientX: number;
    readonly clientY: number;
    readonly ctrlKey: boolean;
    readonly metaKey: boolean;
    readonly movementX: number;
    readonly movementY: number;
    readonly pageX: number;
    readonly pageY: number;
    readonly screenX: number;
    readonly screenY: number;
    readonly shiftKey: boolean;
    readonly x: number;
    readonly y: number;
}

const translateEvent = (stage: Stage, e: MouseEvent): [VugelMouseEvent, ElementCoordinatesInfo<Node>] | undefined => {
    const { x: canvasX, y: canvasY } = getTargetOffset(e);

    const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
    const elementsAtCanvasCoordinate = elementsAtCanvasCoordinates.find((v) => v.element.data?.pointerEvents == true);

    const vOnEvent = mouseEventTranslator[e.type as keyof typeof mouseEventTranslator];
    if (vOnEvent && elementsAtCanvasCoordinate) {
        return [
            {
                // Event
                type: e.type as SupportedMouseEvents,
                currentTarget: elementsAtCanvasCoordinate.element.data ?? null,
                target: elementsAtCanvasCoordinate.element.data ?? null,

                // MouseEvent
                altKey: e.altKey,
                button: e.button,
                buttons: e.buttons,
                clientX: elementsAtCanvasCoordinate.offsetX,
                clientY: elementsAtCanvasCoordinate.offsetY,
                ctrlKey: e.ctrlKey,
                metaKey: e.metaKey,
                movementX: e.movementX,
                movementY: e.movementY,
                pageX: canvasX,
                pageY: canvasY,
                screenX: canvasX,
                screenY: canvasY,
                shiftKey: e.shiftKey,
                x: elementsAtCanvasCoordinate.offsetX,
                y: elementsAtCanvasCoordinate.offsetY,
            },
            elementsAtCanvasCoordinate,
        ];
    }
};

const dispatchMouseEvent: EventDispatcher<MouseEvent> = (stage) => {
    return (e) => {
        switch (e.type as SupportedMouseEvents) {
            case "auxclick":
            case "click":
            case "contextmenu":
            case "dblclick":
            case "mousedown":
            case "mouseup":
            case "mouseenter":
            case "mouseover": {
                const translatedEvent = translateEvent(stage, e);
                if (translatedEvent) {
                    translatedEvent[1].element.data?.[mouseEventTranslator[e.type as SupportedMouseEvents]]?.(
                        translatedEvent[0],
                    );
                }
                break;
            }
            case "mouseleave":
            case "mouseout": {
                // They are the same here because we aren't dealing with child elements, only the canvas
                // Send a "leave" / "out" event to all the nodes currently selected
                break;
            }
            case "mousemove": {
                /**
                 * Also dispatch:
                 * - mouseenter: also dispatch on mouse move by keeping track of currently entered nodes
                 * - mouseleave: also dispatch on mouse move by keeping track of currently entered nodes
                 * - mouseout: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseleave is that it also fires when entering/leaving child components
                 * - mouseover: also dispatch on mouse move by keeping track of currently entered nodes. Diff with mouseenter is that it also fires when entering/leaving child components
                 */
                return translateEvent(stage, e);
            }
        }
    };
};

export type SupportedMouseEvents = keyof Pick<
    GlobalEventHandlersEventMap,
    | "auxclick"
    | "click"
    | "contextmenu"
    | "dblclick"
    | "mousedown"
    | "mouseenter"
    | "mouseleave"
    | "mousemove"
    | "mouseout"
    | "mouseover"
    | "mouseup"
>;

export const mouseEventTranslator: {
    [x in SupportedMouseEvents]: VueEventsOfType<MouseEvent>;
} = {
    auxclick: "onAuxclick",
    click: "onClick",
    contextmenu: "onContextmenu",
    dblclick: "onDblclick",
    mousedown: "onMousedown",
    mouseenter: "onMouseenter",
    mouseleave: "onMouseleave",
    mousemove: "onMousemove",
    mouseout: "onMouseout",
    mouseover: "onMouseover",
    mouseup: "onMouseup",
} as const;

export const registerMouseEventDispatchers = (canvasElement: HTMLCanvasElement, stage: Stage) => {
    for (const key in mouseEventTranslator) {
        canvasElement.addEventListener(key, dispatchMouseEvent(stage) as EventListener);
    }
};
