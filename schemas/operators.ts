import { Schema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import { SchemaImpl, UnwrapSchema } from "./types.ts";
import { isFailResult, isSuccessResult } from "../type_guards.ts";
import { DataFlow } from "../utils.ts";

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
export class OrSchema<T extends Schema[]>
  extends SchemaImpl<UnwrapSchema<T[number]>> {
  #schemas: ReadonlyArray<Schema>;

  constructor(...schemas: T) {
    super();
    this.#schemas = schemas;
  }

  protected override dataFlow: DataFlow<UnwrapSchema<T[number]>> =
    new DataFlow().define(
      (value) => {
        const errors: SchemaError[][] = [];

        for (const schema of this.#schemas) {
          const result = schema.validate(value);

          if (isSuccessResult(result)) {
            return;
          }
          errors.push(result.errors);
        }

        throw new SchemaError(
          `Logical error. One of assertion must be met.`,
          {
            children: errors.flat(),
          },
        );
      },
    );
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
