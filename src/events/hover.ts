import { translateEvent } from "./mouseEvents";
import { VugelStage } from "../wrapper";
import { Node } from "../runtime/nodes";

export const setupHover = (targetElement: HTMLElement, stage: VugelStage) => {
    let currentHoveredTarget: Node | null = null;

    function handleNewHoveredNode(lastHoveredTarget: Node | null, newHoveredTarget: Node | null) {
        if (newHoveredTarget) {
            const cursorType = getCursorType(newHoveredTarget);
            targetElement.style.cursor = cursorType || "";
        }
    }

    function getCursorType(node: Node): string | undefined {
        if (node["cursor-type"]) {
            return node["cursor-type"];
        } else {
            const parent = node.getParentNode();
            if (parent) {
                return getCursorType(parent);
            } else {
                return undefined;
            }
        }
    }

    targetElement.addEventListener("mousemove", (e: MouseEvent) => {
        const translatedEvent = translateEvent(stage, e);
        const newHoveredTarget = translatedEvent.target;
        if (newHoveredTarget !== currentHoveredTarget) {
            const lastHoveredTarget = currentHoveredTarget;
            currentHoveredTarget = newHoveredTarget;
            handleNewHoveredNode(lastHoveredTarget, newHoveredTarget);
        }
    });
};
