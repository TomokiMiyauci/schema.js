import { isFunction, ReturnAssert } from "./deps.ts";
import { Schema } from "./types.ts";
import { SchemaError } from "./errors.ts";
import { toSchemaError } from "./utils.ts";

/** Whether the value is {@link Schema} or not.
 *
 * ```ts
 * import {
 *   isSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 * import { assertEquals } from "https://deno.land/std@$VERSION/testing/asserts.ts";
 *
 * assertEquals(isSchema(new StringSchema()), true);
 * assertEquals(isSchema({ assert: () => {} }), true);
 * assertEquals(isSchema(null), false);
 * ```
 */
export function isSchema<In = unknown, Out extends In = In>(
  value: unknown,
): value is Schema<In, Out> {
  return isFunction(Object(value)["assert"]);
}

/** Types for validate result. */
export type ValidateResult<T = unknown> =
  | {
    /** Whether the validation is passed or not. */
    pass: true;

    /** Validated data. */
    data: T;
  }
  | {
    pass: false;

    /** Schema errors. */
    errors: SchemaError[];
  };

/** Validate value with {@link Schema} definition.
 *
 * @param schema - Any {@link Schema}.
 * @param value - Any value.
 *
 * ```ts
 * import {
 *   ObjectSchema,
 *   StringSchema,
 *   validateSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new ObjectSchema({
 *   name: new StringSchema(),
 *   type: "dog"
 * });
 *
 * const result = validateSchema(schema, {});
 * if (result.pass) {
 *   result.data; // { name: string, type: "dog" }
 * } else {
 *   result.errors; // SchemaError[]
 * }
 * ```
 */
export function validateSchema<T, S extends Schema<T>>(
  schema: S,
  value: T,
): ValidateResult<ReturnAssert<S["assert"]>> {
  try {
    schema.assert(value);
    return {
      pass: true,
      data: value as never,
    };
  } catch (e) {
    return {
      pass: false,
      errors: [toSchemaError(e)],
    };
  }
}

export function isSchemaError(value: unknown): value is SchemaError {
  return value instanceof SchemaError;
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

export function getCount(value: Iterable<unknown>): number {
  return Array.from(value).length;
}

export function getConstructor(value: unknown): Function {
  return new Object(value).constructor;
}

type DateFullyear = string;
type DateMonth = string;
type DateMday = string;
type TimeHour = string;
type TimeMinute = string;
type TimeSecond = string;

type TimeNumoffset = `${"+" | "-"}${TimeHour}:${TimeMinute}`;
type TimeOffset = "Z" | TimeNumoffset;

type PartialType = `${TimeHour}:${TimeMinute}:${TimeSecond}`;

export type FullDate = `${DateFullyear}-${DateMonth}-${DateMday}`;
export type FullTime = `${PartialType}${TimeOffset}`;
export type DateTime = `${FullDate}T${FullTime}`;

function prefixMatch(regExp: RegExp): RegExp {
  const source = regExp.source;
  return source.startsWith("^") ? regExp : new RegExp(`^${source}`);
}

function suffixMatch(regExp: RegExp): RegExp {
  const source = regExp.source;
  return source.endsWith("$") ? regExp : new RegExp(`${source}$`);
}

function exactMatch(regExp: RegExp): RegExp {
  return suffixMatch(prefixMatch(regExp));
}

const ReFullDate =
  /(?:[1-9]\d{3}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1\d|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[1-9]\d(?:0[48]|[2468][048]|[13579][26])|(?:[2468][048]|[13579][26])00)-02-29)/;
export function isDateFormat(value: string): value is FullDate {
  return exactMatch(ReFullDate).test(value);
}

const ReFullTime = /(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:Z|[+-][01]\d:[0-5]\d)/;
export function isTimeFormat(value: string): value is FullTime {
  return exactMatch(ReFullTime).test(value);
}

export function isDateTimeFormat(value: string): value is DateTime {
  const ReDateTime = new RegExp(`${ReFullDate.source}T${ReFullTime.source}`);
  return exactMatch(ReDateTime).test(value);
}

/** @see https://stackoverflow.com/questions/106179/regular-expression-to-match-dns-hostname-or-ip-address */
const ReHostname =
  /^[a-z\d]([a-z\d\-]{0,61}[a-z\d])?(\.[a-z\d]([a-z\d\-]{0,61}[a-z\d])?)*$/i;
export function isHostnameFormat(value: string): value is string {
  return ReHostname.test(value);
}

export type Ipv4Format = `${string}.${string}.${string}.${string}`;

/** @see https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp */
const ReIpv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
export function isIpv4Format(value: string): value is Ipv4Format {
  return ReIpv4.test(value);
}

/** @see https://stackoverflow.com/questions/53497/regular-expression-that-matches-valid-ipv6-addresses */
const ReIpv6 =
  /^([\da-f]{1,4}:){7}[\da-f]{1,4}|([\da-f]{1,4}:){1,7}:|([\da-f]{1,4}:){1,6}:[\da-f]{1,4}|([a-f\d]{1,4}:){1,5}(:[a-f\d]{1,4}){1,2}|([a-f\d]{1,4}:){1,4}(:[a-f\d]{1,4}){1,3}|([a-f\d]{1,4}:){1,3}(:[a-f\d]{1,4}){1,4}|([a-f\d]{1,4}:){1,2}(:[\da-f]{1,4}){1,5}|[\da-f]{1,4}:((:[\da-f]{1,4}){1,6})|:((:[0-9a-f]{1,4}){1,7}|:)|fe80:(:[a-f\d]{0,4}){0,4}%[\da-z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)|([\da-f]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)\.){3}(25[0-5]|(2[0-4]|1{0,1}\d){0,1}\d)$/i;
export function isIpv6Format(value: string): value is string {
  return ReIpv6.test(value);
}
