// Copyright 2022-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { isNonNullable, isString, PartialBy } from "./deps.ts";
import { DataType, Issue, Messenger, type Struct, Wrapper } from "./types.ts";

/** Get constructor name.
 * When the value can not construct, return `"null"` or `"undefined"`.
 */
export function constructorName(value: unknown): string {
  if (isNonNullable(value)) return value.constructor.name;

  return String(value);
}

export class Construct<In, Out extends In> implements Struct<In, Out> {
  #name: string;

  constructor(
    name: string,
    public check: (input: In) => Iterable<PartialBy<Issue, "paths">>,
  ) {
    this.#name = name;
  }

  declare [Struct.type]: Out;

  toString(): string {
    return this.#name;
  }
}

export function formatActExp(expected: unknown, actual: unknown): string {
  return `expected ${expected}, actual ${actual}`;
}

/** Plural-aware formatter. */
export function formatPlural(value: string, number: number): string {
  if (1 < number) {
    value = `${value}s`;
  }

  return `${number} ${value}`;
}

/** Utility for merging issue paths.
 * @internal
 */
export function* mergeIssuePaths(
  issues: Iterable<PartialBy<Issue, "paths">>,
  paths: Iterable<string>,
): Iterable<Issue> {
  for (const issue of issues) {
    yield { message: issue.message, paths: [...paths, ...issue.paths ?? []] };
  }
}

/** Create `Wrapper`.
 * @param input Any input.
 * @internal
 */
export function wrap<T>(input: T): Wrapper<T> {
  return { unwrap: () => input };
}

/** Improved `typeof`. `null` is not `object`
 * @param input Any input.
 * @internal
 */
export function typeOf(input: unknown): DataType {
  return input === null ? "null" : typeof input;
}

/** Resolve message.
 * @param message Message or lazy message.
 * @param context Context.
 * @internal
 */
export function resolveMessage<C>(
  message: string | Messenger<C>,
  context: C,
): string {
  if (isString(message)) return message;

  return message(context);
}

/** Convert input to string.
 * @param input Any input.
 * @internal
 */
export function show(input: unknown): string {
  if (isString(input)) return `"${input}"`;

  return String(input);
}
