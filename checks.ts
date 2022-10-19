import { Arg, CheckOptions, Failure, Infer, Provable } from "./types.ts";
import { SchemaError } from "./error.ts";

export function validate<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
  options?: CheckOptions,
): [data: Infer<Type>, errors: undefined] | [
  data: undefined,
  errors: Failure[],
] {
  const errors = resolveIterable(
    schema.proof(value, { paths: [] }),
    options?.failFast,
  );

  if (errors.length) return [, errors];

  return [value as never, undefined];
}

export function is<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
  options: CheckOptions,
): value is Infer<Type> extends Arg<Schema["proof"], 0> ? Infer<Type> : never {
  const result = validate(schema, value, options);

  return !result[1];
}

/** Assert value with provable schema.
 * @param schema Provable schema.
 * @param value Any value.
 * @throws {SchemaError} When assert fail.
 */
export function assert<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
  options?: CheckOptions,
): asserts value is Infer<Type> extends Arg<Schema["proof"], 0> ? Infer<Type>
  : never {
  const result = validate(schema, value, options);

  if (result[1]) {
    const e = new SchemaError(result[1].map(customFailure));
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

function customFailure({ message, paths, ...rest }: Failure): Failure {
  return {
    message: toString({ message, paths }),
    paths,
    ...rest,
  };
}

function toString({ message, paths }: Failure): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}
