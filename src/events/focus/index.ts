import { FocusManager } from "./FocusManager";
import { Stage } from "tree2d/lib";

let focusManager: FocusManager;

const setupFocusEvents = (canvasElement: HTMLCanvasElement, stage: Stage) => {
    focusManager = new FocusManager(canvasElement, stage);
};

export { setupFocusEvents };
