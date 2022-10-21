import { Checkable, CheckOptions, Infer, StructIssue } from "./types.ts";
import { SchemaError } from "./error.ts";
import { Arg } from "./deps.ts";

export function validate<
  Out extends In,
  In,
  C extends Checkable<Out, In>,
>(
  struct: Checkable<Out, In>,
  input: Arg<C["check"], 0>,
  options?: CheckOptions,
): [data: Infer<Out>, issues: undefined] | [
  data: undefined,
  issues: StructIssue[],
] {
  const issues = resolveIterable(
    struct.check(input, { paths: [] }),
    options?.failFast,
  );

  if (issues.length) return [, issues];

  return [input as never, undefined];
}

export function is<
  Out extends In,
  In,
  C extends Checkable<Out, In>,
>(
  schema: Checkable<Out, In>,
  input: Arg<C["check"], 0>,
  options?: CheckOptions,
): input is Infer<Out> extends Arg<C["check"], 0> ? Infer<Out> : never {
  const result = validate(schema, input, options);

  return !result[1];
}

/** Assert value with checkable.
 * @param checkable
 * @param input Input value.
 * @throws {SchemaError} When assert fail.
 */
export function assert<
  Out extends In,
  In,
  C extends Checkable<Out, In>,
>(
  checkable: Checkable<Out, In>,
  input: Arg<C["check"], 0>,
  options?: CheckOptions,
): asserts input is Infer<Out> extends Arg<C["check"], 0> ? Infer<Out>
  : never {
  const result = validate(checkable, input, options);

  if (result[1]) {
    const e = new SchemaError(result[1].map(customIssue));
    Error.captureStackTrace(e, assert);

    throw e;
  }
}

function resolveIterable<T>(iterable: Iterable<T>, failFast?: boolean): T[] {
  if (failFast) {
    const { done, value } = iterable[Symbol.iterator]().next();

    return done ? [] : [value];
  }
  return [...iterable];
}

function customIssue({ message, paths, ...rest }: StructIssue): StructIssue {
  return {
    message: toString({ message, paths }),
    paths,
    ...rest,
  };
}

function toString(
  { message, paths }: Pick<StructIssue, "message" | "paths">,
): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}
