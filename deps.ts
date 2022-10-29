// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

export {
  isBigint,
  isBoolean,
  isFunction,
  isNegativeNumber,
  isNonNullable,
  isNull,
  isNumber,
  isObject,
  isPositiveNumber,
  isString,
  isSymbol,
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
