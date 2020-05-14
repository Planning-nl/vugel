import { createRendererForStage, VugelRender } from "./runtime";
import {
    ComponentPublicInstance,
    defineComponent,
    Fragment,
    watchEffect,
    h,
    onMounted,
    Ref,
    ref,
} from "@vue/runtime-core";
import { Stage, StageOptions } from "tree2d";
import { EventHelpers, setupEvents } from "./events";
import { Root } from "./runtime/nodes/Root";

export type VugelStage = Stage & { eventHelpers: EventHelpers };

export const Vugel = defineComponent({
    props: {
        settings: {type: Object},
        position: {type: String, default: "relative"}
    },
    setup(props, setupContext) {
        const elRef: Ref<HTMLCanvasElement | undefined> = ref();
        const maxWidth = ref(4096);
        const maxHeight = ref(4096);

        onMounted(() => {
            let rendered = false;
            let vugelRenderer: VugelRender;
            let stage: VugelStage;
            let stageRoot: Root;

            watchEffect(() => {
                if (!rendered && elRef.value) {
                    rendered = true;

                    stage = new Stage(elRef.value, { ...props.settings }) as VugelStage;
                    stage.eventHelpers = setupEvents(props.settings?.eventsTarget || elRef.value, stage);

                    vugelRenderer = createRendererForStage(stage);
                    stageRoot = new Root(stage, stage.root);

                    // Auto-inherit dimensions.
                    stageRoot["func-w"] = (w: number) => w;
                    stageRoot["func-h"] = (w: number, h: number) => h;

                    const maxTextureSize = stage.getMaxTextureSize();
                    maxWidth.value = maxTextureSize / stage.pixelRatio;
                    maxHeight.value = maxTextureSize / stage.pixelRatio;
                }

                const defaultSlot = setupContext.slots.default;
                if (defaultSlot) {
                    vugelRenderer(h(Fragment, defaultSlot()), stageRoot);
                } else {
                    console.warn("No default slot is defined");
                }
            });
        });

        // We need to use a wrapper for flexible size layouting to work with tree2d pixelRatio canvas auto-resizing.
        return () =>
            h(
                "div",
                {
                    class: "custom-renderer-wrapper",
                    style: { position: props.position, maxWidth: maxWidth.value, maxHeight: maxHeight.value },
                },
                [
                    h("canvas", {
                        class: "custom-renderer",
                        style: { position: "absolute", width: "100%", height: "100%" },
                        ref: elRef,
                    }),
                ],
            );
    },
});
