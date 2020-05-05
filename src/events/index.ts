import { VugelStage } from "../wrapper";
import { setupMouseEvents } from "./mouseEvents";
import { setupTouchEvents } from "./touchEvents";
import { FocusEvents, setupFocusEvents } from "./focusEvents";
import { setupKeyboardEvents } from "./keyboardEvents";

export type EventHelpers = {
    focusManager: FocusEvents;
};

export const setupEvents = (targetElement: HTMLElement, stage: VugelStage): EventHelpers => {
    setupMouseEvents(targetElement, stage);
    setupTouchEvents(targetElement, stage);
    const focusManager = setupFocusEvents(targetElement, stage);
    setupKeyboardEvents(targetElement, stage);
    return { focusManager };
};

export * from "./types";
export * from "./mouseEvents";
export * from "./touchEvents";
export * from "./focusEvents";
export * from "./keyboardEvents";
