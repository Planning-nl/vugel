import { createRenderer, RootRenderFunction } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { VugelStage } from "../wrapper";

export function createRendererForStage(stage: VugelStage): RootRenderFunction {
    const { render } = createRenderer({
        patchProp,
        ...nodeOps(stage),
    });

    return render;
}

export * from "./nodes";
