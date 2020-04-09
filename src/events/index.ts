import { Stage } from "tree2d/lib";
import { setupMouseEvents } from "./mouseEvents";
import { setupTouchEvents } from "./touchEvents";
import { setupFocusEvents } from "./focus";
import { FocusManager } from "./focus/FocusManager";

export type EventHelpers = {
    focusManager: FocusManager;
};

export const setupEvents = (canvasElement: HTMLCanvasElement, stage: Stage): EventHelpers => {
    setupMouseEvents(canvasElement, stage);
    setupTouchEvents(canvasElement, stage);
    const focusManager = setupFocusEvents(canvasElement, stage);
    return { focusManager };
};

export * from "./types";
export * from "./mouseEvents";
export * from "./touchEvents";
export * from "./focus";
