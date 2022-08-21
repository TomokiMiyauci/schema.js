import { isFunction } from "./deps.ts";
import { FailResult, Result, Schema, SuccessResult } from "./types.ts";
import { AssertionError, SchemaError } from "./errors.ts";

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
