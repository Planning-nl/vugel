import Stage from "tree2d/dist/tree/Stage";

export function getCanvasOffset(e: PageCoordinates, stage: Stage): { x: number; y: number } {
    const rect = stage.getCanvas().getBoundingClientRect();
    return { x: e.pageX - rect.left, y: e.pageY - rect.top };
}

type PageCoordinates = { pageX: number; pageY: number };
