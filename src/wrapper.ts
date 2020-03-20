import { createRendererForStage, onMounted, VugelRender } from "./runtime/runtime";

import { effect } from "@vue/reactivity";
import { defineComponent, Fragment, h } from "@vue/runtime-core";
import { ref } from "@vue/reactivity";
import Node from "./runtime/nodes/Node";

type VugelPropType = {
    settings: {
        w: number;
        h: number;
    };
};

export const Vugel = defineComponent({
    props: {
        settings: { type: Object, default: { w: 600, h: 600 } }
    },
    setup(props: VugelPropType, setupContext: any) {
        const elRef: any = ref();

        onMounted(() => {
            let rendered = false;
            let vugelRenderer: VugelRender;
            let stage: typeof lng.Stage;
            let stageRoot: Node;

            effect(() => {
                if (!rendered) {
                    rendered = true;
                    const stageOptions = { ...props.settings };
                    stage = new lng.Stage({ ...stageOptions, canvas: elRef.value });

                    vugelRenderer = createRendererForStage(stage);

                    stageRoot = new Node(stage, stage.root);
                }

                vugelRenderer(h(Fragment, setupContext.slots.default()), stageRoot);
            });
        });

        return () => h("canvas", { class: "custom-renderer", ref: elRef });
    }
});
