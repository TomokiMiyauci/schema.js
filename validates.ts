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

export type Ipv4Format = `${string}.${string}.${string}.${string}`;

/** @see https://stackoverflow.com/questions/5284147/validating-ipv4-addresses-with-regexp */
const ReIpv4 = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
export function isIpv4Format(value: string): value is Ipv4Format {
  return ReIpv4.test(value);
}

export function isIpv6Format(value: string): value is string {
  return new RegExp(`^${IPV6ADDRESS}$`).test(value);
}

const ALPHA = `[a-z]`;
const DIGIT = `[0-9]`;
const HEXDIG = `[a-f0-9]`;

// IPv4
const DEC_OCTET_1 = DIGIT; // 0-9
const DEC_OCTET_2 = `[1-9]${DIGIT}` as const; // 10-99
const DEC_OCTET_3 = `1${DIGIT}{2}` as const; // 100-199
const DEC_OCTET_4 = `2[0-4]${DIGIT}` as const; // 200-249
const DEC_OCTET_5 = `25[0-5]`; // 250-255
const DEC_OCTET =
  `(${DEC_OCTET_1}|${DEC_OCTET_2}|${DEC_OCTET_3}|${DEC_OCTET_4}|${DEC_OCTET_5})` as const;
const IPV4ADDRESS = `${DEC_OCTET}(\\.${DEC_OCTET}){3}` as const;

// IPv6
const H16 = `${HEXDIG}{1,4}` as const; // 16 bits of address represented in hexadecimal
const LS32 = `(${H16}:${H16}|${IPV4ADDRESS})` as const; // least-significant 32 bits of address
const IPV6ADDRESS_1 = `(${H16}:){6}${LS32}` as const;
const IPV6ADDRESS_2 = `::(${H16}:){5}${LS32}` as const;
const IPV6ADDRESS_3 = `(${H16})?::(${H16}:){4}${LS32}` as const;
const IPV6ADDRESS_4 = `((${H16}:){0,1}${H16})?::(${H16}:){3}${LS32}` as const;
const IPV6ADDRESS_5 = `((${H16}:){0,2}${H16})?::(${H16}:){2}${LS32}` as const;
const IPV6ADDRESS_6 = `((${H16}:){0,3}${H16})?::${H16}:${LS32}` as const;
const IPV6ADDRESS_7 = `((${H16}:){0,4}${H16})?::${LS32}` as const;
const IPV6ADDRESS_8 = `((${H16}:){0,5}${H16})?::${H16}` as const;
const IPV6ADDRESS_9 = `((${H16}:){0,6}${H16})?::` as const;
const IPV6ADDRESS =
  `(${IPV6ADDRESS_1}|${IPV6ADDRESS_2}|${IPV6ADDRESS_3}|${IPV6ADDRESS_4}|${IPV6ADDRESS_5}|${IPV6ADDRESS_6}|${IPV6ADDRESS_7}|${IPV6ADDRESS_8}|${IPV6ADDRESS_9})` as const;

// Percent-Encoding: https://tools.ietf.org/html/rfc3986#section-2.1
const PCT_ENCODED = `%${HEXDIG}${HEXDIG}`;

// Reserved Characters: https://tools.ietf.org/html/rfc3986#section-2.2
const SUB_DELIMS = `[!$&'()*+,;=]`;

// Unreserved Characters: https://tools.ietf.org/html/rfc3986#section-2.3
const UNRESERVED = `(${ALPHA}|${DIGIT}|[-._~])`;

// Scheme: https://tools.ietf.org/html/rfc3986#section-3.1
const SCHEME = `${ALPHA}(${ALPHA}|${DIGIT}|[+\\-.])*`;

// User Information: https://tools.ietf.org/html/rfc3986#section-3.2.1
const USERINFO = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|:)*`;

// Host: https://tools.ietf.org/html/rfc3986#section-3.2.2
const IPVFUTURE = `v${HEXDIG}+\\.(${UNRESERVED}|${SUB_DELIMS}|:)+`;
const IP_LITERAL = `\\[(${IPV6ADDRESS}|${IPVFUTURE})]`;
const REG_NAME = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS})*`;
const HOST = `(${IP_LITERAL}|${IPV4ADDRESS}|${REG_NAME})`;

// Port: https://tools.ietf.org/html/rfc3986#section-3.2.3
const PORT = `\\d*`;

// Authority: https://tools.ietf.org/html/rfc3986#section-3.2
const AUTHORITY = `(${USERINFO}@)?${HOST}(:${PORT})?`;

// Path: https://tools.ietf.org/html/rfc3986#section-3.3
const PCHAR = `(${UNRESERVED}|${PCT_ENCODED}|${SUB_DELIMS}|[:@])`;
const SEGMENT = `(${PCHAR})*`;
const SEGMENT_NZ = `(${PCHAR})+`;
const PATH_EMPTY = ``; // zero characters
const PATH_ROOTLESS = `${SEGMENT_NZ}(/${SEGMENT})*`; // begins with a segment
const PATH_ABSOLUTE = `/(${SEGMENT_NZ}(/${SEGMENT})*)?`; // begins with "/" but not "//"
const PATH_ABEMPTY = `(/${SEGMENT})*`; // begins with "/" or is empty

// Query: https://tools.ietf.org/html/rfc3986#section-3.4
const QUERY = `(${PCHAR}|[/?])*`;

// Fragment: https://tools.ietf.org/html/rfc3986#section-3.5
const FRAGMENT = `(${PCHAR}|[/?])*`;

// Syntax Components: https://tools.ietf.org/html/rfc3986#section-3
const HIER_PART =
  `(//${AUTHORITY}${PATH_ABEMPTY}|${PATH_ABSOLUTE}|${PATH_ROOTLESS}|${PATH_EMPTY})`;
const URI = `${SCHEME}:${HIER_PART}(\\?${QUERY})?(#${FRAGMENT})?`;
export function isUriFormat(value: string): value is string {
  return new RegExp(`^${URI}$`).test(value);
}
