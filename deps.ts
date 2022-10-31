// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export {
  isFunction,
  isNegativeNumber,
  isNonNullable,
  isNull,
  isObject,
  isPositiveNumber,
  isString,
  isUndefined,
  isValidDate,
} from "https://deno.land/x/isx@1.0.0-beta.23/mod.ts";

/** Create iterator from iterable object. */
export function iter<T>(iterable: Iterable<T>): Iterator<T> {
  return iterable[Symbol.iterator]();
}

/** Get number of elements. */
export function getSize(iterable: Iterable<unknown>): number {
  return [...iterable].length;
}

/** Whether the input is non-negative number or not.
 * Non-negative number means greater than or equal to zero.
 * @param input - Any `number`.
 */
export function isNonNegativeNumber(input: number): boolean {
  return Number.isFinite(input) && 0 <= input;
}

/** Whether the input is non-positive number or not.
 * Non-positive number means less than or equal to zero.
 * @param input - Any `number`.
 */
export function isNonPositiveNumber(input: number): boolean {
  return Number.isFinite(input) && input <= 0;
}

export type PartialBy<T, U extends keyof T> =
  & { [k in keyof T as U extends k ? never : k]: T[k] }
  & {
    [k in U]?: T[k];
  };

export type Writeable<T> = {
  -readonly [k in keyof T]: T[k];
};

/** Whether the type is Top-type or not. */
export type IsTopType<T> = unknown extends T ? true : false;

type Arg<F extends (...args: any) => any, I extends number> = Parameters<
  F
>[I];

export type FirstArg<F extends (...args: any) => any> = Arg<F, 0>;
