"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("./runtime/runtime");
const reactivity_1 = require("@vue/reactivity");
const runtime_core_1 = require("@vue/runtime-core");
const reactivity_2 = require("@vue/reactivity");
const Node_1 = __importDefault(require("./runtime/nodes/Node"));
exports.Vugel = runtime_core_1.defineComponent({
    props: {
        settings: { type: Object, default: { w: 600, h: 600 } }
    },
    setup(props, setupContext) {
        const elRef = reactivity_2.ref();
        runtime_1.onMounted(() => {
            let rendered = false;
            let vugelRenderer;
            let stage;
            let stageRoot;
            reactivity_1.effect(() => {
                if (!rendered) {
                    rendered = true;
                    const stageOptions = Object.assign({}, props.settings);
                    stage = new lng.Stage(Object.assign({}, stageOptions, { canvas: elRef.value }));
                    vugelRenderer = runtime_1.createRendererForStage(stage);
                    stageRoot = new Node_1.default(stage, stage.root);
                }
                vugelRenderer(runtime_core_1.h(runtime_core_1.Fragment, setupContext.slots.default()), stageRoot);
            });
        });
        return () => runtime_core_1.h('canvas', { class: 'custom-renderer', ref: elRef });
    }
});
