import { createRenderer, RootRenderFunction } from '@vue/runtime-core';
import { nodeOps } from './nodeOps';
import { patchProp } from './patchProp';
import Stage from 'tree2d/dist/tree/Stage';
import Element from 'tree2d/dist/tree/Element';
import Base from './nodes/Base';

export type VugelRender = RootRenderFunction<Element, Base>;

export function createRendererForStage(stage: Stage): VugelRender {
    const { render } = createRenderer({
        patchProp,
        ...nodeOps(stage),
    });

    const vugelRender = render as VugelRender;
    return vugelRender;
}

// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
export * from '@vue/runtime-core';
