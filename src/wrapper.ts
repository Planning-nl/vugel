import { createRendererForStage, VugelRender } from "./runtime/runtime";

import { effect, Ref, ref } from "@vue/reactivity";
import { defineComponent, Fragment, h, onMounted } from "@vue/runtime-core";
import Node from "./runtime/nodes/Node";
import Stage from "tree2d/dist/tree/Stage";
import { registerMouseEventDispatchers } from "./events/mouseEvents";
import { registerTouchEventDispatchers } from "./events/touchEvents";

export const Vugel = defineComponent({
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
            let stage: Stage;
            let stageRoot: Node;

            effect(() => {
                if (!rendered && elRef.value) {
                    rendered = true;

                    stage = new Stage(elRef.value, { ...props.settings });

                    vugelRenderer = createRendererForStage(stage);
                    stageRoot = new Node(stage, stage.root);

                    // Auto-inherit dimensions.
                    stageRoot.w = (w: number) => w;
                    stageRoot.h = (h: number) => h;

                    registerMouseEventDispatchers(elRef.value, stage);
                    registerTouchEventDispatchers(elRef.value, stage);
                }

                const defaultSlot = setupContext.slots.default;
                if (defaultSlot) {
                    vugelRenderer(h(Fragment, defaultSlot()), stageRoot);
                } else {
                    console.warn("No default slot is defined");
                }
            });
        });

        return () =>
            h("canvas", {
                class: "custom-renderer",
                ref: elRef,
            });
    },
});
