import { Checkable, CheckOptions, Infer, Issue } from "./types.ts";
import { SchemaError } from "./error.ts";
import { iter } from "./deps.ts";

export function validate<In, Out>(
  checkable: Checkable<In, Out>,
  input: In,
  options?: CheckOptions,
): [data: Infer<Out>, issues: undefined] | [
  data: undefined,
  issues: Issue[],
] {
  const issues = resolveIterable(
    checkable.check(input, { paths: [] }),
    options?.failFast,
  );

  if (issues.length) return [, issues];

  return [input as Infer<Out>, undefined];
}

/** Whether the input satisfies struct or not. With type guard, inputs are type inferred.
 * @param checkable The {@link Checkable} object.
 * @param input Input value.
 * @param options Check options.
 *
 * @example
 * ```ts
 * import { is, string } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertEquals(is(string(), "any input"), true);
 * assertEquals(is(string(), {}), false);
 * ```
 */
export function is<In, Out, T extends In>(
  checkable: Checkable<In, Out>,
  input: T,
  options?: CheckOptions,
): input is Infer<Out> extends T ? Infer<Out> : T & Infer<Out> {
  const result = validate(checkable, input, options);

  return !result[1];
}

/** Assert value with checkable.
 * @param checkable The {@link Checkable} object.
 * @param input Input value.
 * @param options Check options.
 * @throws {SchemaError} When assertion is fail.
 *
 * @example
 * ```ts
 * import {
 *   assert,
 *   maxSize,
 *   minSize,
 *   StructError,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertThrows } from "https://deno.land/std@$VERSION/testing/asserts/mod.ts";
 *
 * assertThrows(() => assert(maxSize(5), "typestruct"), StructError);
 * ```
 */
export function assert<In, Out, T extends In>(
  checkable: Checkable<In, Out>,
  input: T,
  options?: CheckOptions,
): asserts input is Infer<Out> extends T ? Infer<Out>
  : T & Infer<Out> {
  const result = validate(checkable, input, options);

  if (result[1]) {
    const e = new SchemaError(result[1].map(customIssue));
    Error.captureStackTrace(e, assert);

    throw e;
  }
}

function resolveIterable<T>(iterable: Iterable<T>, failFast?: boolean): T[] {
  if (failFast) {
    const { done, value } = iter(iterable).next();

    return done ? [] : [value];
  }
  return [...iterable];
}

function customIssue({ message, paths, ...rest }: Issue): Issue {
  return {
    message: toString({ message, paths }),
    paths,
    ...rest,
  };
}

function toString(
  { message, paths }: Issue,
): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}
