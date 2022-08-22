import { Schema, SuperType } from "../types.ts";
import { SchemaError } from "../errors.ts";
import { SchemaImpl, UnwrapSchema } from "./types.ts";
import { isFailResult, isSuccessResult } from "../type_guards.ts";
import { DataFlow } from "../utils.ts";
import { And, Assertion } from "../deps.ts";

/** Schema definition of logical `OR`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   NullSchema,
 *   NumberSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js/mod.ts";
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

type UnwrapArraySchema<S extends readonly Schema[]> = S extends
  [infer F, ...infer R]
  ? F extends Schema
    ? R extends Schema[] ? [UnwrapSchema<F>, ...UnwrapArraySchema<R>] : []
  : []
  : [];

/** Schema definition of logical `AND`.
 *
 * ```ts
 * import {
 *   AndSchema,
 *   assertSchema,
 *   OrSchema,
 *   StringSchema,
 * } from "https://deno.land/x/schema_js/mod.ts";
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
export class AndSchema<T extends Schema[]>
  extends SchemaImpl<And<UnwrapArraySchema<T>>> {
  #schemas: ReadonlyArray<Schema>;

  constructor(...schemas: T) {
    super();
    this.#schemas = schemas;
  }

  protected override dataFlow: DataFlow<And<UnwrapArraySchema<T>>> =
    new DataFlow().define(
      (value) => {
        for (const schema of this.#schemas) {
          const result = schema.validate(value);

          if (isFailResult(result)) {
            throw new SchemaError(
              `Logical error. All assertions must be met.`,
              {
                children: result.errors,
              },
            );
          }
        }
      },
    );
}

/** Schema definition of logical `NOT`.
 *
 * ```ts
 * import {
 *   assertSchema,
 *   BooleanSchema,
 *   NotSchema,
 * } from "https://deno.land/x/schema_js/mod.ts";
 *
 * const value: unknown = undefined;
 * assertSchema(new NotSchema(new BooleanSchema()), value);
 * // value is `string` | `number` | ...
 * assertSchema(new NotSchema(new BooleanSchema(true)), value);
 * // value is `false` | `string` | `number` | ...
 * ```
 */
export class NotSchema<T extends Schema>
  extends SchemaImpl<TypedExclude<UnwrapSchema<T>>> {
  constructor(protected schema: T) {
    super();
  }

  protected override dataFlow: DataFlow<any> = new DataFlow().define(
    createAssertNot.call(this),
  );
}

function createAssertNot<T extends Schema>(
  this: NotSchema<T>,
): Assertion<unknown, T> {
  return (value) => {
    const result = this.schema.validate(value);
    const name = this.schema.constructor.name;

    if (isSuccessResult(result)) {
      throw new SchemaError(
        `NOT logical operation fail. \`${name}\` should not valid.`,
      );
    }
  };
}

type TypedExclude<T, U = SuperType> = U extends T ? never
  : T extends Function ? U
  : U | Function;
