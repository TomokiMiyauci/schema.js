import { Result, Schema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import { isFailResult, isSuccessResult } from "../asserts.ts";

/** Schema definition of logical `OR`.
 *
 * ```ts
 * import {
 *   NumberSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js/mod.ts";
 *
 * const stringOrNumberSchema = new OrSchema(
 *   new StringSchema(),
 *   new NumberSchema(),
 * );
 * ```
 */
export class OrSchema<T> implements Schema<T> {
  #schemas: ReadonlyArray<Schema>;
  constructor(...schemas: ReadonlyArray<Schema>) {
    this.#schemas = schemas;
  }

  validate(value: unknown): Result<T> {
    const errors: SchemaError[][] = [];

    for (const schema of this.#schemas) {
      const result = schema.validate(value);

      if (isSuccessResult(result)) {
        return {
          data: value as T,
        };
      }
      errors.push(result.errors);
    }

    return {
      errors: [
        new SchemaError(
          `Logical error. One of assertion must be met.`,
          {
            children: errors.flat(),
          },
        ),
      ],
    };
  }
}

export class AndSchema<S extends Schema> implements Schema {
  #schemas: ReadonlyArray<Schema>;
  constructor(...schemas: ReadonlyArray<S>) {
    this.#schemas = schemas;
  }
  validate(value: unknown) {
    for (const schema of this.#schemas) {
      const result = schema.validate(value);

      if (isFailResult(result)) {
        return {
          errors: [
            new SchemaError(
              `Logical error. All assertions must be met.`,
              { children: result.errors },
            ),
          ],
        };
      }
    }

    return {
      data: value,
    };
  }
}
