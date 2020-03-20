import { baseCompile, baseParse, CompilerOptions, CodegenResult, ParserOptions, RootNode } from '@vue/compiler-core';

import { parserOptionsMinimal } from './parserOptionsMinimal';

const parserOptions = parserOptionsMinimal;

export function compile(template: string, options: CompilerOptions = {}): CodegenResult {
    return baseCompile(template, {
        ...parserOptions,
        ...options,
        nodeTransforms: [...(options.nodeTransforms || [])],
        directiveTransforms: {
            ...(options.directiveTransforms || {}),
        },
    });
}

export function parse(template: string, options: ParserOptions = {}): RootNode {
    return baseParse(template, {
        ...parserOptions,
        ...options,
    });
}

export * from '@vue/compiler-core';
