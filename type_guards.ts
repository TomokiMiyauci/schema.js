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

export function isLengthBy(
  length: number | bigint,
  value: { length: number },
): boolean {
  return length === value.length;
}

export function isMaxLength(
  maxLength: number,
  value: { length: number },
): boolean {
  return value.length <= maxLength;
}

export function isMinLength(
  minLength: number,
  value: { length: number },
): boolean {
  return minLength <= value.length;
}

export function isSizeBy(
  base: number | bigint,
  value: Iterable<unknown>,
): boolean {
  return base === Array.from(value).length;
}

export function isSameSize(
  base: Iterable<unknown>,
  value: Iterable<unknown>,
): boolean {
  return Array.from(base).length === Array.from(value).length;
}

export function isEmailFormat(value: string): boolean {
  return ReEmail.test(value);
}

/** @see https://stackoverflow.com/a/46181/1550155 */
const ReEmail =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
