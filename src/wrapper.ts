import { createRendererForStage, VugelRender } from "./runtime/runtime";
import {
    defineComponent,
    Fragment,
    h,
    onMounted,
    ComponentPublicInstance,
    ComponentInternalInstance,
    Ref,
    ref,
    effect,
    getCurrentInstance,
} from "@vue/runtime-core";
import { Stage } from "tree2d/lib";
import { setupEvents, EventHelpers } from "./events";
import { StageOptions } from "tree2d/lib/tree/Stage";
import { Root } from "./runtime/nodes/Root";

export type VugelInstance = ComponentInternalInstance & { eventHelpers: EventHelpers };
export type VugelStage = Stage & { vugel: VugelInstance };

export const Vugel: {
    new (): ComponentPublicInstance<Partial<StageOptions>>;
} = defineComponent({
    props: {
        settings: {
            type: Object,
        },
    },
    setup(props, setupContext) {
        const elRef: Ref<HTMLCanvasElement | undefined> = ref();

        onMounted(() => {
            let rendered = false;
            let vugelRenderer: VugelRender;
            let stage: VugelStage;
            let stageRoot: Root;

            const currentInstance = getCurrentInstance();
            if (currentInstance) {
                currentInstance.update = effect(() => {
                    if (!rendered && elRef.value) {
                        rendered = true;

                        stage = new Stage(elRef.value, { ...props.settings }) as VugelStage;

                        (stage as any).vugel = currentInstance;

                        const eventHelpers = setupEvents(elRef.value, stage);
                        (currentInstance as VugelInstance).eventHelpers = eventHelpers;

                        vugelRenderer = createRendererForStage(stage);
                        stageRoot = new Root(stage, stage.root);

                        // Auto-inherit dimensions.
                        stageRoot.w = (w: number) => w;
                        stageRoot.h = (h: number) => h;
                    }

                    const defaultSlot = setupContext.slots.default;
                    if (defaultSlot) {
                        vugelRenderer(h(Fragment, defaultSlot()), stageRoot);
                    } else {
                        console.warn("No default slot is defined");
                    }
                });
            }
        });

        return () =>
            h("canvas", {
                class: "custom-renderer",
                ref: elRef,
            });
    },
});
