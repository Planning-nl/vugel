import Stage from "tree2d/dist/tree/Stage";
import { mouseEventTranslator } from "./mouseEvents";
import { touchEventTranslator } from "./touchEvents";

export type VugelEventListener<T extends Event> = (event: T) => any;
export type VugelEventDispatcher<T extends Event> = (stage: Stage) => VugelEventListener<T>;
export type VugelEventTranslator<ON extends string, T extends Event> = {
    [name in keyof GlobalEventHandlersEventMap]?: [ON, VugelEventDispatcher<T>];
};

export const eventTranslators = {
    ...mouseEventTranslator,
    ...touchEventTranslator,
} as const;
