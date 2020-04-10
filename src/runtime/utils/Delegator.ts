import { AnyClass } from "./types";

export default class Delegator {
    public static delegate<T extends AnyClass, U extends AnyClass>(base: T, delegate: U, property: string) {
        const descriptors = Object.getOwnPropertyDescriptors(delegate.prototype);
        const names = Object.keys(descriptors);
        for (let i = 0, n = names.length; i < n; i++) {
            const name = names[i];
            if (name !== "constructor") {
                this.delegateProperty(name, descriptors[name], base.prototype, property);
            }
        }
    }

    private static delegateProperty(name: string, descriptor: PropertyDescriptor, obj: any, objProperty: string) {
        const proxyDescriptor: PropertyDescriptor = { ...descriptor };
        if (proxyDescriptor.get) {
            proxyDescriptor.get = function () {
                return (this as any)[objProperty][name];
            };
        }
        if (proxyDescriptor.set) {
            proxyDescriptor.set = function (v: any) {
                (this as any)[objProperty][name] = v;
            };
        }
        if (proxyDescriptor.value && proxyDescriptor.value instanceof Function) {
            proxyDescriptor.value = function (...args: any[]) {
                return (this as any)[objProperty][name](...args);
            };
        }
        Object.defineProperty(obj, name, proxyDescriptor);
    }
}
