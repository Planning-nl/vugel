import { createRenderer, RootRenderFunction } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { VugelStage } from "../wrapper";

export type VugelRender = RootRenderFunction;

export function createRendererForStage(stage: VugelStage): VugelRender {
    const { render } = createRenderer({
        patchProp,
        ...nodeOps(stage),
    });

    return render as VugelRender;
}

export * from "@vue/runtime-core";
export * from "./nodes";
