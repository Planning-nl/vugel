"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_core_1 = require("@vue/runtime-core");
const compile_1 = require("./compile");
const runtimeDom = __importStar(require("../runtime/runtime"));
const compileCache = Object.create(null);
function compileToFunction(template, options) {
    if (!(typeof template === "string")) {
        if (template.nodeType) {
            template = template.innerHTML;
        }
        else {
            runtime_core_1.warn(`invalid template option: `, template);
            return () => { };
        }
    }
    const key = template;
    const cached = compileCache[key];
    if (cached) {
        return cached;
    }
    if (template[0] === '#') {
        const el = document.querySelector(template);
        if (!el) {
            runtime_core_1.warn(`Template element not found or is empty: ${template}`);
        }
        template = el ? el.innerHTML : ``;
    }
    const { code } = compile_1.compile(template, Object.assign({ hoistStatic: true, onError(err) {
            const message = `Template compilation error: ${err.message}`;
            const codeFrame = err.loc;
            runtime_core_1.warn(codeFrame ? `${message}\n${codeFrame}` : message);
        } }, options));
    const render = new Function('Vue', code)(runtimeDom);
    return (compileCache[key] = render);
}
exports.default = compileToFunction;
