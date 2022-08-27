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
