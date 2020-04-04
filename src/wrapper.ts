import { createRendererForStage, VugelRender } from "./runtime/runtime";
import {
    defineComponent,
    Fragment,
    h,
    onMounted,
    ComponentPublicInstance,
    Ref,
    ref,
    effect,
    getCurrentInstance,
} from "@vue/runtime-core";
import Node from "./runtime/nodes/Node";
import { Stage } from "tree2d/lib";
import { registerMouseEventDispatchers } from "./events";
import { registerTouchEventDispatchers } from "./events";
import { StageOptions } from "tree2d/lib/tree/Stage";

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
            let stage: Stage;
            let stageRoot: Node;

            const currentInstance = getCurrentInstance();
            if (currentInstance) {
                currentInstance.update = effect(() => {
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
            }
        });

        return () =>
            h("canvas", {
                class: "custom-renderer",
                ref: elRef,
            });
    },
});
