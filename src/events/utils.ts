import { ElementCoordinatesInfo } from "tree2d/lib";
import { Node } from "../runtime/nodes/Node";
import { Base } from "../runtime/nodes/Base";
import { VugelStage } from "../wrapper";

export function getCanvasOffset(e: PageCoordinates, stage: VugelStage): { x: number; y: number } {
    const rect = stage.getCanvas().getBoundingClientRect();
    return { x: e.pageX - (rect.left + window.scrollX), y: e.pageY - (rect.top + window.scrollY) };
}

export function getCurrentContext(
    e: PageCoordinates,
    stage: VugelStage,
): {
    currentElement: ElementCoordinatesInfo<Node> | undefined;
    canvasOffsetX: number;
    canvasOffsetY: number;
} {
    const { x: canvasX, y: canvasY } = getCanvasOffset(e, stage);

    const elementsAtCanvasCoordinates = stage.getElementsAtCoordinates<Node>(canvasX, canvasY);
    return {
        currentElement: elementsAtCanvasCoordinates.find((v) => v.element.data?.capturePointerEvents()),
        canvasOffsetX: canvasX,
        canvasOffsetY: canvasY,
    };
}

export function getAncestors(node: Node): Base[] {
    const path = [];
    let n: Base | undefined = node;
    do {
        path.push(n);
        n = n.parent;
    } while (n !== undefined);
    return path.reverse();
}

export function getCommonAncestor(node1: Node | undefined, node2: Node | undefined): Base | undefined {
    if (!node1 || !node2) {
        return undefined;
    }

    const pathNode1 = getAncestors(node1);
    const pathNode2 = getAncestors(node2);

    const m = Math.min(pathNode1.length, pathNode2.length);
    let index;
    for (index = 0; index < m; index++) {
        if (pathNode1[index] !== pathNode2[index]) {
            break;
        }
    }

    return index > 0 ? pathNode1[index - 1] : undefined;
}

type PageCoordinates = { pageX: number; pageY: number };
