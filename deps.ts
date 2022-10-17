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
  isTruthy,
} from "https://deno.land/x/isx@1.0.0-beta.22/mod.ts";
export { type json } from "https://deno.land/x/pure_json@1.0.0-beta.1/mod.ts";

export function isNonNullable(value: unknown): value is {} {
  return !isNullable(value);
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
