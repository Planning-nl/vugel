import { createRendererForStage, onMounted, VugelRender } from "./runtime/runtime";

import { effect, ref } from "@vue/reactivity";
import { defineComponent, Fragment, h } from "@vue/runtime-core";
import Node from "./runtime/nodes/Node";
import Stage from "tree2d/dist/tree/Stage";

export const Vugel = defineComponent({
    props: {
        settings: { type: Object, default: { w: 600, h: 600 } },
    },
    setup(props, setupContext) {
        const elRef: any = ref();

        onMounted(() => {
            let rendered = false;
            let vugelRenderer: VugelRender;
            let stage: Stage;
            let stageRoot: Node;

            effect(() => {
                if (!rendered) {
                    rendered = true;
                    const stageOptions = { ...props.settings };
                    elRef.value.width = stageOptions.w || 600;
                    elRef.value.height = stageOptions.h || 600;
                    stage = new Stage(elRef.value, { ...stageOptions });

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

        return () => h("canvas", { class: "custom-renderer", ref: elRef });
    },
});
