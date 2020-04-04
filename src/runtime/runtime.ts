import { createRenderer, RootRenderFunction } from "@vue/runtime-core";
import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { Stage } from "tree2d/lib";

export type VugelRender = RootRenderFunction;

export function createRendererForStage(stage: Stage): VugelRender {
    const { render } = createRenderer({
        patchProp,
        ...nodeOps(stage),
    });

    return render as VugelRender;
}
