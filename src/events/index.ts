import { VugelStage } from "../wrapper";
import { setupMouseEvents } from "./mouseEvents";
import { setupTouchEvents } from "./touchEvents";
import { FocusEvents, setupFocusEvents } from "./focusEvents";
import { setupKeyboardEvents } from "./keyboardEvents";
import { setupHover } from "./hover";

export type EventHelpers = {
    focusManager: FocusEvents;
};

export const setupEvents = (targetElement: HTMLElement, stage: VugelStage): EventHelpers => {
    setupMouseEvents(targetElement, stage);
    setupTouchEvents(targetElement, stage);
    const focusManager = setupFocusEvents(targetElement, stage);
    setupKeyboardEvents(targetElement, stage);
    setupHover(targetElement, stage);
    return { focusManager };
};

export * from "./types";
export * from "./mouseEvents";
export * from "./touchEvents";
export * from "./focusEvents";
export * from "./keyboardEvents";
export * from "./hover";
