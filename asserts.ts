import { FailResult, Result, Schema, SuccessResult } from "./types.ts";

/** Assert whether the value satisfies the schema.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   BooleanSchema,
 * } from "https://deno.land/x/schema_js/mod.ts";
 *
 * const value: unknown = true;
 * assertSchema(new BooleanSchema(), value);
 * // value is `boolean`
 * assertSchema(new BooleanSchema(true), value);
 * // value is `true`
 * assertSchema(new BooleanSchema(false), value); // throws SchemaError
 * ```
 *
 * @throws {@link AggregateError}
 */
export function assertSchema<
  S extends Schema,
  R extends ReturnType<S["validate"]>,
>(
  schema: S,
  value: unknown,
): asserts value is R extends SuccessResult ? R["data"]
  : never {
  const result = schema.validate(value);

  if ("errors" in result) {
    throw new AggregateError(result.errors, `One or more error has occurred.`);
  }
}

export function isSuccessResult<T>(
  result: Result<T>,
): result is SuccessResult<T> {
  return "data" in result;
}

export function isFailResult<T>(result: Result<T>): result is FailResult {
  return "errors" in result;
}
