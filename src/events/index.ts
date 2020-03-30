import Stage from "tree2d/dist/tree/Stage";
import { mouseEventTranslator } from "./mouseEvents";
import { touchEventTranslator } from "./touchEvents";

export type EventDispatcher<T extends Event> = (stage: Stage) => (ev: T) => any;
export type EventTranslator<ON extends string> = {
    [name in keyof GlobalEventHandlersEventMap]?: [ON, EventDispatcher<GlobalEventHandlersEventMap[name]>];
};

export const eventTranslators = {
    ...mouseEventTranslator,
    ...touchEventTranslator,
} as const;
