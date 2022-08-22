export {
  isBoolean,
  isEmpty,
  isFunction,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isSymbol,
  isUndefined,
} from "https://deno.land/x/isx@1.0.0-beta.19/mod.ts";

type MaybeFalsy = typeof NaN | 0 | -0 | 0n | "" | null | undefined | false;

type MaybeTruthy =
  | Extract<string, "">
  | Extract<number, typeof NaN | 0 | -0>
  | Extract<bigint, 0n>
  | symbol
  | true
  | object;

export function isFalsy(value: unknown): value is MaybeFalsy {
  return !value;
}

export function isBigint(value: unknown): value is bigint {
  return typeof value === "bigint";
}

export function isTruthy(value: unknown): value is MaybeTruthy {
  return !!value;
}

export type valueOf<T> = T[keyof T];

export type ReturnIsType<T extends (arg: any) => arg is any> = T extends
  (arg: any) => arg is infer R ? R : any;

export type PickBy<T, K extends valueOf<T>> = {
  [P in keyof T as T[P] extends K ? P : never]: T[P];
};

export type Assertion<V, R extends V> = (value: V) => asserts value is R;

export type TypeGuard<V, R extends V> = (value: V) => value is R;

export function arity<
  F extends (...args: any) => any,
  Params extends Parameters<F> = Parameters<F>,
>(fn: F, arg: Params[0]): (...rest: Rest<Params>) => ReturnType<F> {
  return (...rest) => {
    return fn.apply(null, [arg, ...rest]);
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

export type And<T extends readonly any[]> = T extends [infer F, ...infer R]
  ? F & And<R>
  : unknown;
