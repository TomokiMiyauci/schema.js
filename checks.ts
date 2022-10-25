import { Checkable, CheckOptions, Infer, Issue } from "./types.ts";
import { StructError } from "./error.ts";
import { iter, PartialBy } from "./deps.ts";

/** Validate result. */
export type ValidateResult<T> = {
  /** Whether the input is valid or not. */
  valid: true;

  /** Actual input with inferred types. */
  data: T;
} | {
  /** Whether the input is invalid or not. */
  valid: false;

  /** Data structure issues. */
  errors: Issue[];
};

/** Returns the checking result. If input satisfies struct, the `valid` field is
 * `true` and returns an object with type-inferred `data`. Otherwise, the `valid`
 * field is `false` and returns an object containing the `errors` field.
 * @param checkable The {@link Checkable} object.
 * @param input Input value.
 * @param options Check options.
 *
 * @example
 * ```ts
 * import {
 *   number,
 *   object,
 *   validate,
 * } from "https://deno.land/x/typestruct@$VERSION/mod.ts";
 * import { assertEquals } from "[https://](https://deno.land/std@$VERSION/testing/asserts/mod.ts)";
 *
 * const Product = object({
 *   price: number(),
 * });
 * assertEquals(validate(Product, { price: 100 }), {
 *   valid: true,
 *   data: { price: 100 },
 * });
 * ```
 */
export function validate<In, Out extends In>(
  checkable: Checkable<In, Out>,
  input: In,
  options?: CheckOptions,
): ValidateResult<Infer<Out>> {
  const issues = resolveIterable(
    checkable.check(input),
    options?.failFast,
  );

  if (issues.length) return { valid: false, errors: issues.map(fill) };

  return { valid: true, data: input as Infer<Out> };
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
export function is<In, Out extends In, T extends In>(
  checkable: Checkable<In, Out>,
  input: T,
  options?: CheckOptions,
): input is Infer<Out> extends T ? Infer<Out> : T & Infer<Out> {
  const result = validate(checkable, input as In, options);

  return result.valid;
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
export function assert<In, Out extends In, T extends In>(
  checkable: Checkable<In, Out>,
  input: T,
  options?: CheckOptions,
): asserts input is Infer<Out> extends T ? Infer<Out>
  : T & Infer<Out> {
  const result = validate(checkable, input as In, options);

  if (!result.valid) {
    const e = new StructError(result.errors.map(formatIssue));
    Error.captureStackTrace(e, assert);

    throw e;
  }
}

function resolveIterable<T>(iterable: Iterable<T>, only?: boolean): T[] {
  if (only) {
    const { done, value } = iter(iterable).next();

    return done ? [] : [value];
  }
  return [...iterable];
}

function formatIssue({ message, paths }: Issue): Issue {
  return {
    message: toString({ message, paths }),
    paths,
  };
}

function fill({ paths = [], message }: PartialBy<Issue, "paths">): Issue {
  return { message, paths };
}

function toString({ message, paths }: Issue): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}
