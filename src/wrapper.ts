import { createRendererForStage, VugelRender } from "./runtime";
import { defineComponent, Fragment, watchEffect, h, onMounted, Ref, ref, getCurrentInstance } from "@vue/runtime-core";
import { Stage } from "tree2d";
import { EventHelpers, setupEvents } from "./events";
import { Root } from "./runtime/nodes/Root";

export type VugelStage = Stage & { eventHelpers: EventHelpers };

export const Vugel = defineComponent({
    props: {
        settings: { type: Object },
        position: { type: String, default: "relative" },
    },
    setup(props, setupContext) {
        const elRef: Ref<HTMLCanvasElement | undefined> = ref();

        const maxWidth = ref(4096);
        const maxHeight = ref(4096);

        const vugelComponentInstance = getCurrentInstance()!;

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

                    // Keep correct aspect-ratio issues when the page is zoomed out.
                    const maxTextureSize = stage.getMaxTextureSize();
                    maxWidth.value = maxTextureSize / stage.pixelRatio;
                    maxHeight.value = maxTextureSize / stage.pixelRatio;
                }

                const defaultSlot = setupContext.slots.default;
                if (defaultSlot) {
                    const node = h(Connector, defaultSlot);
                    vugelRenderer(node, stageRoot);
                } else {
                    console.warn("No default slot is defined");
                }
            });
        });

        /**
         * Since vugel uses its own renderer, the ancestor vue's appContext, root and provides would
         * normally be lost in the slot-specified vugel component.
         *
         * By overriding the component's parent before rendering the slot contents, we can make sure that
         * these features will propagate into the user-specified vugel component.
         */
        const Connector = defineComponent({
            setup(props, setupContext) {
                const instance = getCurrentInstance()!;

                // @see runtime-core createComponentInstance
                instance.parent = vugelComponentInstance;
                instance.appContext = vugelComponentInstance.appContext;
                instance.root = vugelComponentInstance.root;
                (instance as any).provides = (vugelComponentInstance as any).provides;

                const defaultSlot = setupContext.slots.default!;
                return () => h(Fragment, defaultSlot());
            },
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
