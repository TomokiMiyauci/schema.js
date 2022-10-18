import { Arg, Failure, Infer, Provable } from "./types.ts";

export function validate<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
): [data: Infer<Type>, errors: undefined] | [
  data: undefined,
  errors: Failure[],
] {
  const errors = [...schema.proof(value, { paths: [] })];

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
): value is Infer<Type> extends Arg<Schema["proof"], 0> ? Infer<Type> : never {
  const result = validate(schema, value);

  return !result[1];
}

export function assert<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
): asserts value is Infer<Type> extends Arg<Schema["proof"], 0> ? Infer<Type>
  : never {
  const result = validate(schema, value);

  if (result[1]) {
    const e = new Error(result[1].map(toString).join());
    e.stack = undefined;
    throw e;
  }
}

function toString({ message, paths }: Failure): string {
  const pathInfo = paths.length ? ["$", ...paths].join(".") + " - " : "";

  return pathInfo + message;
}
