import { RenderFunction, warn } from "@vue/runtime-core";
import { CompilerError, CompilerOptions } from "@vue/compiler-core";
import { compile } from "./compile";
import * as runtimeVugel from "../runtime";

const compileCache: Record<string, RenderFunction> = Object.create(null);

export function compileVugel(template: string | HTMLElement, options?: CompilerOptions): RenderFunction {
    if (!(typeof template === "string")) {
        if (template.nodeType) {
            template = template.innerHTML;
        } else {
            warn(`invalid template option: `, template);
            return () => {
                // Noop
            };
        }
    }

    const key = template;
    const cached = compileCache[key];
    if (cached) {
        return cached;
    }

    if (template[0] === "#") {
        const el = document.querySelector(template);
        if (!el) {
            warn(`Template element not found or is empty: ${template}`);
        }
        template = el ? el.innerHTML : ``;
    }

    const { code } = compile(template, {
        hoistStatic: true,
        onError(err: CompilerError) {
            const message = `Template compilation error: ${err.message}`;
            const codeFrame = err.loc;
            warn(codeFrame ? `${message}\n${codeFrame}` : message);
        },
        ...options,
    });

    const render = new Function("Vue", code)(runtimeVugel) as RenderFunction;
    return (compileCache[key] = render);
}
