import { isNullable } from "https://deno.land/x/isx@1.0.0-beta.22/mod.ts";
export {
  hasOwn,
  isBigint,
  isBoolean,
  isFunction,
  isNull,
  isNullable,
  isNumber,
  isObject,
  isString,
  isSymbol,
  isTruthy,
  isUndefined,
} from "https://deno.land/x/isx@1.0.0-beta.22/mod.ts";
export { type json } from "https://deno.land/x/pure_json@1.0.0-beta.1/mod.ts";
export { prop } from "https://deno.land/x/prelude_js@1.0.0-beta.3/mod.ts";

export function isNonNullable(value: unknown): value is {} {
  return !isNullable(value);
}

/** Create iterator from iterable object. */
export function iter<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}

export function isNativeObject(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  return isNonNullable(value) && value.constructor === Object;
}

export interface JSONObject {
  [k: string]: JSONObject | string | null | number | boolean | JSONObject[];
}

export type UnionToIntersection<U> = (
  U extends unknown ? (_: U) => void : never
) extends (_: infer I) => void ? I : never;

export type PartialBy<T, U extends keyof T> =
  & { [k in keyof T as U extends k ? never : k]: T[k] }
  & {
    [k in U]?: T[k];
  };

export type Arg<F extends (...args: any) => any, N extends number> = Parameters<
  F
>[N];

export type Is<T extends Function> = T extends (value: any) => value is infer X
  ? X
  : never;

export type Writeable<T> = {
  -readonly [k in keyof T]: T[k];
};

/** Whether the type is Top-type or not. */
export type IsTopType<T> = unknown extends T ? true : false;
