import { Node } from "../runtime/nodes/Node";
import { EventTranslator, RegisterEventDispatcher, TranslatedEvent, VueEventsOfType, VugelEvent } from "./index";
import { Stage } from "tree2d/lib";
import { getCurrentContext } from "./utils";

export interface VugelMouseEvent extends VugelEvent<MouseEvent | TouchEvent> {
    readonly canvasOffsetX: number;
    readonly canvasOffsetY: number;
    readonly elementOffsetX: number;
    readonly elementOffsetY: number;
}

export type MouseEventState = {
    activeNode?: Node;
};

const translateEvent: EventTranslator<MouseEvent, VugelMouseEvent> = (stage, e) => {
    const { currentElement, canvasOffsetX, canvasOffsetY } = getCurrentContext(e, stage);
    const currentNode = currentElement?.element.data;

    return {
        event: {
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
        },
        currentElement: currentElement,
    };
};

const isNodeInTree = (nodeToFind: Node, leafNode: Node): boolean => {
    let currentNode: Node | undefined = leafNode;
    while (currentNode != undefined) {
        if (currentNode == nodeToFind) return true;
        currentNode = currentNode.parentNode as Node | undefined;
    }
    return false;
};

// https://www.w3.org/TR/uievents/#events-mouse-types
const dispatchMouseEvent = (stage: Stage, eventState: MouseEventState) => {
    return (e: MouseEvent) => {
        const translatedEvent = translateEvent(stage, e);
        dispatchVugelMouseEvent(translatedEvent, eventState);
    };
};

export const dispatchVugelMouseEvent = (
    translatedEvent: TranslatedEvent<VugelMouseEvent>,
    eventState: MouseEventState,
) => {
    const prevNode = eventState.activeNode;
    const currentNode = translatedEvent.currentElement?.element.data;

    switch (translatedEvent.event.type as SupportedMouseEvents) {
        case "auxclick":
        case "click":
        case "contextmenu":
        case "dblclick":
        case "mousedown":
        case "mouseup": {
            currentNode?.dispatchBubbledEvent(translatedEvent.event);
            break;
        }
        case "mouseenter": {
            eventState.activeNode = undefined;

            if (currentNode) {
                eventState.activeNode = currentNode;

                currentNode.dispatchVugelEvent({
                    ...translatedEvent.event,
                    target: currentNode,
                });
            }

            break;
        }
        case "mouseover": {
            eventState.activeNode = undefined;

            if (currentNode) {
                eventState.activeNode = currentNode;

                currentNode?.dispatchBubbledEvent({
                    ...translatedEvent.event,
                    target: currentNode,
                });
            }

            break;
        }
        case "mouseleave": {
            prevNode?.dispatchVugelEvent({
                ...translatedEvent.event,
                target: prevNode,
            });
            break;
        }
        case "mouseout": {
            prevNode?.dispatchBubbledEvent({
                ...translatedEvent.event,
                target: prevNode,
            });

            break;
        }
        case "mousemove": {
            if (currentNode) {
                currentNode.dispatchBubbledEvent(translatedEvent.event);

                if (prevNode != currentNode) {
                    prevNode?.dispatchBubbledEvent({
                        ...translatedEvent.event,
                        type: "mouseout",
                        target: currentNode,
                    });

                    currentNode.dispatchBubbledEvent({
                        ...translatedEvent.event,
                        type: "mouseover",
                        target: currentNode,
                    });
                }

                if (!prevNode || !isNodeInTree(currentNode, prevNode)) {
                    currentNode.dispatchBubbledEvent({
                        ...translatedEvent.event,
                        type: "mouseenter",
                        target: currentNode,
                    });
                }

                if (prevNode && !isNodeInTree(prevNode, currentNode)) {
                    prevNode.dispatchBubbledEvent({
                        ...translatedEvent.event,
                        type: "mouseleave",
                        target: currentNode,
                    });
                }

                eventState.activeNode = currentNode;
            }
        }
    }
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

export const setupMouseEvents: RegisterEventDispatcher = (canvasElement, stage) => {
    const eventState: MouseEventState = {};

    for (const key in mouseEventTranslator) {
        canvasElement.addEventListener(key, dispatchMouseEvent(stage, eventState) as EventListener);
    }
};
