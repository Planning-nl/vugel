import Stage from "tree2d/dist/tree/Stage";
import { SupportedMouseEvents } from "./mouseEvents";
import Node from "../runtime/nodes/Node";
import { Events } from "@vue/runtime-dom";

export interface VugelEvent {
    readonly currentTarget: Node | null;
    readonly target: Node | null;
    readonly type: SupportedMouseEvents; //| keyof typeof touchEventTranslator;
}

export type EventListener<T extends Event> = (event: T) => any;
export type EventDispatcher<T extends Event> = (stage: Stage) => EventListener<T>;

export type VugelEventListener<T extends VugelEvent> = (event: T) => any;

export type VueEventsOfType<T extends Event> = keyof Pick<
    Events,
    {
        [K in keyof Events]: Events[K] extends T ? (T extends Events[K] ? K : never) : never;
    }[keyof Events]
>;
