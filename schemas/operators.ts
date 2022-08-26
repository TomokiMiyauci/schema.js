import { Schema, SuperType, UnwrapSchema } from "../types.ts";
import { SchemaError } from "../errors.ts";
import { DataFlow, toSchema, toSchemaError } from "../utils.ts";
import { assertAnd, assertOr } from "../asserts.ts";
import { And, Assert } from "../deps.ts";

/** Schema definition of logical `OR`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   NullSchema,
 *   NumberSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new OrSchema(
 *   new StringSchema(),
 *   new NumberSchema(),
 *   new NullSchema(),
 * );
 * const value: unknown = undefined;
 * assertSchema(schema, value);
 * // value is `string` | `number` | null
 * ```
 */
export class OrSchema<T extends unknown[]>
  implements Schema<unknown, UnwrapSchema<T[number]>> {
  #schemas: readonly unknown[];

  constructor(...schemas: T) {
    this.#schemas = schemas;
  }

  assert = new DataFlow().and(
    (value) => {
      const asserts = this.#schemas.map((schema) => toSchema(schema).assert);
      assertOr(asserts, value);
    },
  ).build() as Assert<unknown, UnwrapSchema<T[number]>>;
}

/** Schema definition of logical `AND`.
 *
 * ```ts
 * import {
 *   AndSchema,
 *   assertSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const schema = new AndSchema(
 *   new StringSchema("hello"),
 *   new StringSchema(),
 * );
 * const value: unknown = undefined;
 * assertSchema(schema, value);
 * // value is `"hello"`
 * ```
 */
export class AndSchema<T extends readonly unknown[]>
  implements Schema<unknown, And<UnwrapSchema<T>>> {
  #schemas: readonly unknown[];

  constructor(...schemas: T) {
    this.#schemas = schemas;
  }

  assert = new DataFlow().and(
    (value) => {
      const schemas = this.#schemas.map((schema) => toSchema(schema).assert);
      assertAnd(schemas, value);
    },
  ).build() as Assert<unknown, And<UnwrapSchema<T>>>;
}

/** Schema definition of logical `NOT`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   BooleanSchema,
 *   NotSchema,
 * } from "https://deno.land/x/schema_js@$VERSION/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new NotSchema(new BooleanSchema()), value);
 * // value is `string` | `number` | ...
 * assertSchema(new NotSchema(new BooleanSchema(true)), value);
 * // value is `false` | `string` | `number` | ...
 * ```
 */
export class NotSchema<T extends Schema>
  implements Schema<unknown, Exclude<SuperType, UnwrapSchema<T>>> {
  assert;

  constructor(schema: T) {
    this.assert = createAssertNot(schema) as Assert<
      unknown,
      Exclude<SuperType, UnwrapSchema<T>>
    >;
  }
}

function createAssertNot<T extends Schema>(
  schema: T,
): Assert<unknown, T> {
  return (value) => {
    try {
      schema.assert(value);
      const name = schema.constructor.name;
      throw new SchemaError(
        `NOT logical operation fail. \`${name}\` should not valid.`,
      );
    } catch {
      // noop
    }
  };
}
