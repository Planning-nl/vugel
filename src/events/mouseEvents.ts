import { Node } from "../runtime/nodes/Node";
import { EventTranslator, RegisterEventDispatcher, TranslatedEvent, VueEventsOfType, VugelEvent } from "./index";
import { getCommonAncestor, getCurrentContext } from "./utils";
import { VugelStage } from "../wrapper";

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
        currentNode = currentNode.parent as Node | undefined;
    }
    return false;
};

// https://www.w3.org/TR/uievents/#events-mouse-types
const dispatchMouseEvent = (stage: VugelStage, eventState: MouseEventState) => {
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

                currentNode.dispatchEvent({
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

                currentNode?.dispatchBubbledEvent(
                    {
                        ...translatedEvent.event,
                        target: currentNode,
                    },
                    getCommonAncestor(prevNode, currentNode),
                );
            }

            break;
        }
        case "mouseleave": {
            prevNode?.dispatchEvent({
                ...translatedEvent.event,
                target: prevNode,
            });
            break;
        }
        case "mouseout": {
            prevNode?.dispatchBubbledEvent(
                {
                    ...translatedEvent.event,
                    target: prevNode,
                },
                getCommonAncestor(prevNode, currentNode),
            );

            break;
        }
        case "mousemove": {
            if (currentNode) {
                const commonAncestor = getCommonAncestor(prevNode, currentNode);

                if (prevNode != currentNode) {
                    prevNode?.dispatchBubbledEvent(
                        {
                            ...translatedEvent.event,
                            type: "mouseout",
                            target: currentNode,
                        },
                        commonAncestor,
                    );
                }

                if (prevNode && !isNodeInTree(prevNode, currentNode)) {
                    prevNode.dispatchEvent({
                        ...translatedEvent.event,
                        type: "mouseleave",
                        target: currentNode,
                    });
                }

                if (prevNode != currentNode) {
                    currentNode.dispatchBubbledEvent(
                        {
                            ...translatedEvent.event,
                            type: "mouseover",
                            target: currentNode,
                        },
                        commonAncestor,
                    );
                }

                if (!prevNode || !isNodeInTree(currentNode, prevNode)) {
                    currentNode.dispatchEvent({
                        ...translatedEvent.event,
                        type: "mouseenter",
                        target: currentNode,
                    });
                }

                // Mousemove
                currentNode.dispatchBubbledEvent(translatedEvent.event);

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
