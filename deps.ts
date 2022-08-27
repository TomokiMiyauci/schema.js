// TODO:(miyauci) All modules here should be external modules.

export {
  isBigint,
  isBoolean,
  isDate,
  isEmpty,
  isError,
  isFalse,
  isFalsy,
  isFunction,
  isNegativeNumber,
  isNonNegativeInteger,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isSymbol,
  isTruthy,
  isUndefined,
} from "https://deno.land/x/isx@1.0.0-beta.20/mod.ts";
import {
  isBigint,
  isString,
} from "https://deno.land/x/isx@1.0.0-beta.20/mod.ts";
export {
  assertArray,
  assertBigint,
  assertBoolean,
  assertCountIs,
  assertDate,
  assertEmailFormat,
  assertExistsPropertyOf,
  assertFunction,
  assertGreaterThanOrEqualTo,
  AssertionError,
  assertIs,
  assertLengthIs,
  assertLessThanOrEqualTo,
  assertNoNNegativeInteger,
  assertNull,
  assertNumber,
  assertObject,
  assertSameCount,
  assertString,
  assertSymbol,
  assertUndefined,
} from "https://deno.land/x/assertion@1.0.0-beta.1/mod.ts";

export type valueOf<T> = T[keyof T];

export type ReturnIsType<T extends (arg: any) => arg is any> = T extends
  (arg: any) => arg is infer R ? R : any;

export type PickBy<T, K extends valueOf<T>> = {
  [P in keyof T as T[P] extends K ? P : never]: T[P];
};

export type Assert<V = unknown, R extends V = V> = (
  value: V,
) => asserts value is R;

export type ReturnAssert<T> = T extends (value: any) => asserts value is infer U
  ? U
  : never;

export type ReturnIterable<T extends Iterable<unknown>> = Exclude<
  ReturnType<ReturnType<T[typeof Symbol.iterator]>["next"]>,
  IteratorReturnResult<unknown>
>["value"];

export type TypeGuard<V, R extends V> = (value: V) => value is R;

export function arity<
  F extends (...args: any) => any,
  Params extends Parameters<F> = Parameters<F>,
>(fn: F, arg: Params[0]): (...rest: Rest<Params>) => ReturnType<F> {
  return (...rest) => {
    return fn(...[arg, ...rest]);
  };
}

type Rest<T extends readonly unknown[]> = T extends [infer _, ...infer R] ? R
  : never;

export type Upcast<T> = T extends string ? string
  : T extends number ? number
  : T extends bigint ? bigint
  : T extends boolean ? boolean
  : T extends symbol ? symbol
  : T extends undefined ? undefined
  : T extends null ? null
  : T extends Function ? Function
  : T extends object ? object
  : never;

export type And<T extends readonly any[]> = T extends
  readonly [infer F, ...infer R] ? F & And<R>
  : unknown;

export function inspect(value: unknown): string {
  if (isString(value)) {
    return `"${value}"`;
  }
  if (isBigint(value)) {
    return `${value}n`;
  }

  return String(value);
}

export function has<T extends PropertyKey, U extends unknown>(
  key: PropertyKey,
  value: U,
): value is U & { [k in T]: unknown } {
  return key in Object(value);
}
