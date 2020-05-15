import { AnyClass } from "./TypeUtils";

export function mixin(target: AnyClass, source: AnyClass) {
    Object.getOwnPropertyNames(source.prototype).forEach((name) => {
        Object.defineProperty(target.prototype, name, Object.getOwnPropertyDescriptor(source.prototype, name)!);
    });
}
