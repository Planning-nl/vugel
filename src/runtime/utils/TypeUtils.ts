import { ColorUtils } from "tree2d";

export type Constructor<T> = new (...args: any[]) => T;
export type AnyClass = Constructor<any>;

export function ensureColor(v: any): number {
    return ColorUtils.getArgbFromAny(v);
}

export function ensureInt(v: any): number {
    if (typeof v === "number") {
        return v;
    } else {
        return parseInt(v as any) || 0;
    }
}

export function ensureFloat(v: any): number {
    if (typeof v === "number") {
        return v;
    } else {
        return parseFloat(v as any) || 0.0;
    }
}

export function ensureBoolean(v: any): boolean {
    return v !== "false" && !!v;
}

export function isString(value: any): value is string {
    return typeof value === "string";
}

export function isNumber(value: any): value is number {
    return typeof value === "number";
}

export function parseFloatStrict(value: string) {
    if (/^([-+])?([0-9]+(\.[0-9]+)?|Infinity)$/.test(value)) return Number(value);
    return NaN;
}
