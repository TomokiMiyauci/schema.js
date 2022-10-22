import { Checkable, CheckOptions, Infer, Issue } from "./types.ts";
import { SchemaError } from "./error.ts";
import { iter } from "./deps.ts";

export function validate<S>(
  struct: Checkable<S>,
  input: unknown,
  options?: CheckOptions,
): [data: Infer<S>, issues: undefined] | [
  data: undefined,
  issues: Issue[],
] {
  const issues = resolveIterable(
    struct.check(input, { paths: [] }),
    options?.failFast,
  );

  if (issues.length) return [, issues];

  return [input as never, undefined];
}

export function is<S>(
  struct: Checkable<S>,
  input: unknown,
  options?: CheckOptions,
): input is Infer<S> {
  const result = validate(struct, input, options);

  return !result[1];
}

/** Assert value with checkable.
 * @param checkable
 * @param input Input value.
 * @throws {SchemaError} When assert fail.
 */
export function assert<S>(
  checkable: Checkable<S>,
  input: unknown,
  options?: CheckOptions,
): asserts input is Infer<S> {
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
