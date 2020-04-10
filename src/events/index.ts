import { VugelStage } from "../wrapper";
import { setupMouseEvents } from "./mouseEvents";
import { setupTouchEvents } from "./touchEvents";
import { FocusEvents, setupFocusEvents } from "./focusEvents";
import { setupKeyboardEvents } from "./keyboardEvents";

export type EventHelpers = {
    focusManager: FocusEvents;
};

export const setupEvents = (canvasElement: HTMLCanvasElement, stage: VugelStage): EventHelpers => {
    setupMouseEvents(canvasElement, stage);
    setupTouchEvents(canvasElement, stage);
    const focusManager = setupFocusEvents(canvasElement, stage);
    setupKeyboardEvents(canvasElement, stage);
    return { focusManager };
};

export * from "./types";
export * from "./mouseEvents";
export * from "./touchEvents";
export * from "./focusEvents";
export * from "./keyboardEvents";
