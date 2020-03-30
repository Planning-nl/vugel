import { createRendererForStage, VugelRender } from "./runtime/runtime";

import { effect, Ref, ref } from "@vue/reactivity";
import { defineComponent, Fragment, h, onMounted } from "@vue/runtime-core";
import Node from "./runtime/nodes/Node";
import Stage from "tree2d/dist/tree/Stage";
import { eventTranslators } from "./events";

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

                    for (const [key, value] of Object.entries(eventTranslators)) {
                        if (value) {
                            elRef.value.addEventListener(key, value[1](stage) as EventListener);
                        }
                    }

                    vugelRenderer = createRendererForStage(stage);
                    stageRoot = new Node(stage, stage.root);
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
