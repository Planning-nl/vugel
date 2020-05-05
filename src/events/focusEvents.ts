import { Node } from "../runtime/nodes/Node";
import { getCommonAncestor, getCurrentContext } from "./utils";
import { RegisterEventDispatcher, VugelEvent } from "./types";
import { VugelStage } from "../wrapper";

export class FocusEvents {
    private focusedNode?: Node = undefined;
    private updatingFocusPath: boolean = false;

    constructor(private targetElement: HTMLElement, private stage: VugelStage) {
        this.ensureCanvasFocusable();
        this.targetElement.addEventListener("click", (e) => this.onCanvasClick(e));
        this.targetElement.addEventListener("blur", (e) => this.onCanvasBlur(e));
    }

    getFocusedNode(): Node | undefined {
        return this.focusedNode;
    }

    private ensureCanvasFocusable() {
        if (!this.targetElement.hasAttribute("tabindex")) {
            this.targetElement.setAttribute("tabindex", "-1");
        }
    }

    private onCanvasClick(e: MouseEvent) {
        // Automatically focus on clicked elements.
        const { currentElement } = getCurrentContext(e, this.stage);
        const node = currentElement?.element.data;
        this.setFocus(node);
    }

    private onCanvasBlur(e: FocusEvent) {
        this.setFocus(undefined);
    }

    public setFocus(focused: Node | undefined) {
        if (this.updatingFocusPath) {
            console.warn(
                "It's not allowed to focus from within a focus-related event. Use setInterval to schedule a focus change.",
            );
        } else if (this.focusedNode !== focused) {
            this.updateFocusPath(focused);
        }
    }

    public updateFocusPath(newFocusedNode: Node | undefined) {
        this.updatingFocusPath = true;

        const prevFocusedNode = this.focusedNode;
        const commonAncestor = getCommonAncestor(this.focusedNode, newFocusedNode);

        this.focusedNode = newFocusedNode;

        // Use event order as specified in https://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order

        if (prevFocusedNode) {
            prevFocusedNode.dispatchBubbledEvent(
                this.createFocusEvent("focusout", prevFocusedNode, newFocusedNode),
                commonAncestor,
            );
        }

        if (newFocusedNode) {
            newFocusedNode.dispatchBubbledEvent(
                this.createFocusEvent("focusin", newFocusedNode, prevFocusedNode),
                commonAncestor,
            );
        }

        if (prevFocusedNode) {
            prevFocusedNode.dispatchEvent(this.createFocusEvent("blur", prevFocusedNode, newFocusedNode));
        }

        if (newFocusedNode) {
            newFocusedNode.dispatchEvent(this.createFocusEvent("focus", newFocusedNode, prevFocusedNode));
        }

        this.updatingFocusPath = false;
    }

    private createFocusEvent(
        type: SupportedFocusEvents,
        target: Node | undefined,
        relatedTarget: Node | undefined,
    ): VugelFocusEvent {
        return {
            cancelBubble: false,

            // Event
            type,

            relatedTarget: relatedTarget ?? null,
            target: target ?? null,
            currentTarget: null,

            originalEvent: undefined,
        };
    }
}

export interface VugelFocusEvent extends VugelEvent {
    relatedTarget: Node | null;
}

export type SupportedFocusEvents = keyof Pick<GlobalEventHandlersEventMap, "focusin" | "focusout" | "focus" | "blur">;

export const focusEventTranslator: {
    [x in SupportedFocusEvents]: "onFocusin" | "onFocusout" | "onFocus" | "onBlur";
} = {
    focusin: "onFocusin",
    focusout: "onFocusout",
    focus: "onFocus",
    blur: "onBlur",
} as const;

export const setupFocusEvents: RegisterEventDispatcher = (targetElement: HTMLElement, stage: VugelStage) => {
    return new FocusEvents(targetElement, stage);
};
