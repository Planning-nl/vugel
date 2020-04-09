import { createRendererForStage, VugelRender } from "./runtime/runtime";
import {
    ComponentPublicInstance,
    defineComponent,
    effect,
    Fragment,
    getCurrentInstance,
    h,
    onMounted,
    Ref,
    ref,
} from "@vue/runtime-core";
import { Stage } from "tree2d/lib";
import { EventHelpers, setupEvents } from "./events";
import { StageOptions } from "tree2d/lib/tree/Stage";
import { Root } from "./runtime/nodes/Root";

export type VugelStage = Stage & { eventHelpers: EventHelpers };

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
                        stage.eventHelpers = setupEvents(elRef.value, stage);

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
