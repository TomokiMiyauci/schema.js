import { Arg, Infer, Provable } from "./types.ts";

export function validate<
  Type extends T,
  T,
  Schema extends Provable<Type, T> = Provable<Type, T>,
>(
  schema: Provable<Type, T>,
  value: Arg<Schema["proof"], 0>,
): [data: Infer<Type>, errors: undefined] | [data: undefined, errors: Error[]] {
  const errors = [...schema.proof(value)];
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
    throw new AggregateError(
      result[1],
      "One or more assertion error has occur.",
    );
  }
}
