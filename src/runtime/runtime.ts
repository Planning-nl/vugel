import {
  createRenderer,
  RootRenderFunction
} from '@vue/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProp } from './patchProp'

export type VugelRender = RootRenderFunction<Node, typeof lng.Element>

export function createRendererForStage(stage: typeof lng.Stage) : VugelRender {
  const { render } = createRenderer({
    patchProp,
    ...nodeOps(stage)
  });

  const vugelRender = (render as VugelRender);
  return vugelRender;
}

// re-export everything from core
// h, Component, reactivity API, nextTick, flags & types
export * from '@vue/runtime-core'

