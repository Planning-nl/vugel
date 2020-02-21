import { RootRenderFunction } from '@vue/runtime-core';
export declare type VugelRender = RootRenderFunction<Node, typeof lng.Element>;
export declare function createRendererForStage(stage: typeof lng.Stage): VugelRender;
export * from '@vue/runtime-core';
