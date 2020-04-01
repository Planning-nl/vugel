import { Stage, ElementCoordinatesInfo } from "tree2d";
import Node from "../runtime/nodes/Node";

export function getCanvasOffset(e: PageCoordinates, stage: Stage): { x: number; y: number } {
    const rect = stage.getCanvas().getBoundingClientRect();
    return { x: e.pageX - rect.left, y: e.pageY - rect.top };
}

export function getCurrentContext(
    e: PageCoordinates,
    stage: Stage,
): {
    currentElement: ElementCoordinatesInfo<Node> | undefined;
    canvasOffsetX: number;
    canvasOffsetY: number;
} {
    const { x: canvasX, y: canvasY } = getCanvasOffset(e, stage);

    const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
    return {
        currentElement: elementsAtCanvasCoordinates.find((v) => v.element.data?.pointerEvents == true),
        canvasOffsetX: canvasX,
        canvasOffsetY: canvasY,
    };
}

type PageCoordinates = { pageX: number; pageY: number };
