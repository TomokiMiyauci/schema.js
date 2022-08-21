import {
  isBoolean,
  isFunction,
  isNull,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
} from "./deps.ts";
import { FailResult, Result, Schema, SuccessResult } from "./types.ts";
import {
  createAssertFromTypeGuard,
  createSchemaErrorThrower,
  inspect,
} from "./utils.ts";
import { AssertionError, SchemaError } from "./errors.ts";
import { isObject } from "https://deno.land/x/isx@1.0.0-beta.19/mod.ts";

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

export function isSchema(value: unknown): value is Schema {
  return isFunction(Object(value)["validate"]);
}

export function isSchemaError(value: unknown): value is SchemaError {
  return value instanceof SchemaError;
}

export function isAssertionError(value: unknown): value is AssertionError {
  return value instanceof AssertionError;
}

export function assertString(value: unknown): asserts value is string {
  createAssertFromTypeGuard(
    isString,
    createSchemaErrorThrower("string"),
  ).call(null, value);
}

export function assertBoolean(value: unknown): asserts value is boolean {
  createAssertFromTypeGuard(
    isBoolean,
    createSchemaErrorThrower("boolean"),
  ).call(null, value);
}

export function assertNumber(value: unknown): asserts value is number {
  createAssertFromTypeGuard(
    isNumber,
    createSchemaErrorThrower("number"),
  ).call(null, value);
}

function isBigint(value: unknown): value is bigint {
  return typeof value === "bigint";
}

export function assertBigint(value: unknown): asserts value is bigint {
  const _ = createAssertFromTypeGuard(
    isBigint,
    createSchemaErrorThrower("number"),
  )(value);
}

export function assertNull(value: unknown): asserts value is null {
  createAssertFromTypeGuard(
    isNull,
    createSchemaErrorThrower("null"),
  ).call(null, value);
}

export function assertUndefined(value: unknown): asserts value is undefined {
  createAssertFromTypeGuard(
    isUndefined,
    createSchemaErrorThrower("undefined"),
  ).call(null, value);
}

export function assertSymbol(value: unknown): asserts value is symbol {
  createAssertFromTypeGuard(
    isSymbol,
    createSchemaErrorThrower("symbol"),
  ).call(null, value);
}

export function assertFunction(value: unknown): asserts value is Function {
  createAssertFromTypeGuard(
    isFunction,
    createSchemaErrorThrower("function"),
  ).call(null, value);
}

export function assertObject(value: unknown): asserts value is object {
  createAssertFromTypeGuard(
    isObject,
    createSchemaErrorThrower("object"),
  ).call(null, value);
}

export function assertIs<T>(base: T, value: unknown): asserts value is T {
  const valid = Object.is(base, value);

  if (!valid) {
    throw new AssertionError(
      `Not equal: ${inspect(base)} <- ${inspect(value)}`,
    );
  }
}
