import { setupMouseEvents } from "./mouseEvents";
import { setupTouchEvents } from "./touchEvents";
import { VugelStage } from "../wrapper";
import { FocusEvents, setupFocusEvents } from "./focusEvents";

export type EventHelpers = {
    focusManager: FocusEvents;
};

export const setupEvents = (canvasElement: HTMLCanvasElement, stage: VugelStage): EventHelpers => {
    setupMouseEvents(canvasElement, stage);
    setupTouchEvents(canvasElement, stage);
    const focusManager = setupFocusEvents(canvasElement, stage);
    return { focusManager };
};

export * from "./types";
export * from "./mouseEvents";
export * from "./touchEvents";
export * from "./focusEvents";
