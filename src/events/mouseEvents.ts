import Node from "../runtime/nodes/Node";
import { EventTranslator, RegisterEventDispatcher, VueEventsOfType, VugelEvent } from "./index";
import Stage from "tree2d/dist/tree/Stage";
import { getCanvasOffset } from "./utils";

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

type EventState = {
    hasTriggeredOutEvent: boolean;
    activeNode?: Node;
};

const translateEvent: EventTranslator<MouseEvent, VugelMouseEvent> = (stage, e) => {
    const { x: canvasX, y: canvasY } = getCanvasOffset(e, stage);

    const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
    const topLevelElement = elementsAtCanvasCoordinates.find((v) => v.element.data?.pointerEvents == true);

    return {
        event: {
            // Event
            type: e.type as SupportedMouseEvents,
            currentTarget: topLevelElement?.element.data ?? null,
            target: topLevelElement?.element.data ?? null,

            // MouseEvent
            altKey: e.altKey,
            button: e.button,
            buttons: e.buttons,
            clientX: topLevelElement?.offsetX ?? 0,
            clientY: topLevelElement?.offsetY ?? 0,
            ctrlKey: e.ctrlKey,
            metaKey: e.metaKey,
            movementX: e.movementX,
            movementY: e.movementY,
            pageX: canvasX,
            pageY: canvasY,
            screenX: canvasX,
            screenY: canvasY,
            shiftKey: e.shiftKey,
            x: topLevelElement?.offsetX ?? 0,
            y: topLevelElement?.offsetY ?? 0,
        },
        topLevelElement,
    };
};

const isNodeInTree = (nodeToFind: Node, leafNode: Node): boolean => {
    return applyToTree(leafNode, (currentNode) => {
        return nodeToFind == currentNode;
    });
};

/**
 * Applies a function to an entire tree
 * @param leafNode the leaf node to start the tree climbing from
 * @param f the function to apply. Returns whether the iteration should quit.
 *
 * @returns whether the tree climbing stopped earlier because f returned true.
 */
const applyToTree = (leafNode: Node, f: (currentNode: Node) => boolean): boolean => {
    let currentNode: Node | undefined = leafNode;
    while (currentNode != undefined) {
        if (f(currentNode)) return true;
        currentNode = currentNode.parentNode as Node | undefined;
    }

    return false;
};

const dispatchMouseEvent = (stage: Stage, eventState: EventState) => {
    return (e: MouseEvent) => {
        const vueEventType = mouseEventTranslator[e.type as SupportedMouseEvents];

        const translatedEvent = translateEvent(stage, e);

        switch (e.type as SupportedMouseEvents) {
            case "auxclick":
            case "click":
            case "contextmenu":
            case "dblclick":
            case "mousedown":
            case "mouseup": {
                if (translatedEvent) {
                    const topLevelNode = translatedEvent?.topLevelElement?.element.data;
                    topLevelNode?.nodeEvents[vueEventType]?.(translatedEvent.event);
                }
                break;
            }
            case "mouseenter":
            case "mouseover": {
                // We ignore these as they are handled by "mousemove"
                break;
            }
            case "mouseleave":
            case "mouseout": {
                // They are the same here because we aren't dealing with child elements, only the canvas
                // Send a "leave" / "out" event to all the nodes currently selected
                eventState.activeNode?.nodeEvents[vueEventType]?.({
                    ...translatedEvent.event,

                    currentTarget: eventState.activeNode,
                    target: eventState.activeNode,
                });

                if (eventState.hasTriggeredOutEvent) {
                    eventState.activeNode = undefined;
                    eventState.hasTriggeredOutEvent = false;
                } else {
                    eventState.hasTriggeredOutEvent = true;
                }

                break;
            }
            case "mousemove": {
                const topLevelElement = translatedEvent.topLevelElement;
                if (topLevelElement) {
                    const topLevelNode = topLevelElement.element.data!;

                    applyToTree(topLevelNode, (currentNode) => {
                        currentNode.nodeEvents["onMousemove"]?.(translatedEvent.event);
                        return false;
                    });

                    if (eventState.activeNode != topLevelNode) {
                        eventState.activeNode?.nodeEvents["onMouseout"]?.({
                            ...translatedEvent.event,

                            type: "mouseout",
                            currentTarget: eventState.activeNode,
                            target: topLevelNode,
                        });

                        topLevelNode.nodeEvents["onMouseover"]?.({
                            ...translatedEvent.event,

                            type: "mouseover",
                            currentTarget: topLevelNode,
                            target: topLevelNode,
                        });
                    }

                    if (!eventState.activeNode || !isNodeInTree(topLevelNode, eventState.activeNode)) {
                        topLevelNode.nodeEvents["onMouseenter"]?.({
                            ...translatedEvent.event,

                            type: "mouseenter",
                            currentTarget: topLevelNode,
                            target: topLevelNode,
                        });
                    }

                    if (eventState.activeNode && !isNodeInTree(eventState.activeNode, topLevelNode)) {
                        eventState.activeNode.nodeEvents["onMouseleave"]?.({
                            ...translatedEvent.event,

                            type: "mouseleave",
                            currentTarget: eventState.activeNode,
                            target: topLevelNode,
                        });
                    }

                    eventState.activeNode = topLevelNode;
                }
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

export const registerMouseEventDispatchers: RegisterEventDispatcher = (canvasElement, stage) => {
    const eventState: EventState = {
        hasTriggeredOutEvent: false,
    };

    for (const key in mouseEventTranslator) {
        canvasElement.addEventListener(key, dispatchMouseEvent(stage, eventState) as EventListener);
    }
};
