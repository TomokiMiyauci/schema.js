import { Checkable, CheckOptions, Infer, Issue } from "./types.ts";
import { SchemaError } from "./error.ts";
import { iter } from "./deps.ts";

export function validate<Out extends In, In>(
  checkable: Checkable<Out, In>,
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

export function is<Out extends In, In, T extends In>(
  checkable: Checkable<Out, In>,
  input: T,
  options?: CheckOptions,
): input is Infer<Out> extends T ? Infer<Out> : never {
  const result = validate(checkable, input as In, options);

  return !result[1];
}

/** Assert value with checkable.
 * @param checkable
 * @param input Input value.
 * @throws {SchemaError} When assertion is fail.
 */
export function assert<Out extends In, In, T extends In>(
  checkable: Checkable<Out, In>,
  input: T,
  options?: CheckOptions,
): asserts input is Infer<Out> extends T ? Infer<Out>
  : never {
  const result = validate(checkable, input as In, options);

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
