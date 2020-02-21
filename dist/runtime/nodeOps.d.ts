import Base from './nodes/Base';
import { RendererOptions } from "@vue/runtime-core";
export declare const nodeOps: (stage: any) => Pick<RendererOptions<Base, Base>, "querySelector" | "setElementText" | "insert" | "remove" | "createElement" | "createText" | "createComment" | "setText" | "parentNode" | "nextSibling" | "setScopeId" | "cloneNode" | "insertStaticContent">;
