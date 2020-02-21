import { CompilerOptions, CodegenResult, ParserOptions, RootNode } from '@vue/compiler-core';
export declare function compile(template: string, options?: CompilerOptions): CodegenResult;
export declare function parse(template: string, options?: ParserOptions): RootNode;
export * from '@vue/compiler-core';
